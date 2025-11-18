
import base64
import modal
import os
import traceback
import numpy as np
from pydantic import BaseModel
import requests
import uuid

app = modal.App("music-generator")

# ------------------ IMAGE SETUP ------------------
image = (
    modal.Image.debian_slim()
    .apt_install("git", "ffmpeg")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(
        [
            "git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step",
            "cd /tmp/ACE-Step && pip install ."
        ]
    )
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompts")
)
hello 
# ------------------ VOLUMES & SECRETS ------------------
model_volume = modal.Volume.from_name("ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-cache", create_if_missing=True)
music_gen_secrets = modal.Secret.from_name("music-gen-secret")


# ------------------ RESPONSE MODEL ------------------
class GenerateMusicResponse(BaseModel):
    audio_data: str  # base64 encoded audio data
    error: str | None = None


# ------------------ SAFE AUDIO SAVE FUNCTION ------------------
def safe_save_wav(audio: np.ndarray, path: str, sr: int = 44100):
    import soundfile as sf
    try:
        audio = np.asarray(audio)

        if np.any(np.isnan(audio)) or np.any(np.isinf(audio)):
            raise ValueError("Audio contains NaN or Inf values!")
        if audio.size == 0 or audio.size > 10**8:
            raise ValueError(f"Invalid audio length: {audio.size}")

        max_val = np.max(np.abs(audio))
        if max_val > 0:
            audio = audio / max_val

        if audio.ndim == 1:
            audio = np.expand_dims(audio, axis=0)
        if audio.shape[0] < audio.shape[1]:
            audio = audio.T

        sf.write(path, audio, sr)
    except Exception as e:
        print("❌ Failed to save WAV:", e)
        traceback.print_exc()
        raise


# ------------------ MODEL SERVER CLASS ------------------
@app.cls(
    image=image,
    gpu="L40S",
    volumes={"/models": model_volume, "/.cache/huggingface": hf_volume},
    secrets=[music_gen_secrets],
    scaledown_window=15
)
class MusicGenServer:
    @modal.enter()
    def load_model(self):
        from acestep.pipeline_ace_step import ACEStepPipeline
        import acestep.pipeline_ace_step as ace
        import numpy as np, soundfile as sf

        # ✅ Updated safe save function that supports both save_path and file_path
        def safe_save_wav_file(
                self,
                audio_array=None,
                file_path=None,
                save_path=None,
                sr=44100,
                sample_rate=None,
                backend="soundfile"
            ):
            try:
                # Pick correct path
                file_path = file_path or save_path
                if file_path is None:
                    raise ValueError("No valid path provided to save audio.")

                # Handle either sr or sample_rate
                sr = sample_rate or sr

                audio_array = np.asarray(audio_array)
                if np.any(np.isnan(audio_array)) or np.any(np.isinf(audio_array)):
                    raise ValueError("Invalid audio (NaN or Inf values)")
                if audio_array.size == 0 or audio_array.size > 10**8:
                    raise ValueError(f"Invalid audio length: {audio_array.size}")

                max_val = np.max(np.abs(audio_array))
                if max_val > 0:
                    audio_array = audio_array / max_val

                if audio_array.ndim == 1:
                    audio_array = np.expand_dims(audio_array, axis=0)
                if audio_array.shape[0] < audio_array.shape[1]:
                    audio_array = audio_array.T

                sf.write(file_path, audio_array, sr)
                print(f"✅ Audio saved safely at {file_path} (sr={sr})")

            except Exception as e:
                print("❌ safe_save_wav_file failed:", e)
                import traceback; traceback.print_exc()
                raise

            

        # Monkey-patch ACE-Step’s internal save function
        ace.ACEStepPipeline.save_wav_file = safe_save_wav_file
        print("✅ Patched ACE-Step save_wav_file for safer audio saving.")

        # Load models
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from diffusers import AutoPipelineForText2Image
        import torch

        print("🚀 Loading models...")

        # Music generation model
        self.music_model = ACEStepPipeline(
            checkpoint_dir="/models",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False
        )

        # Prompt generation LLM
        modal_id = "Qwen/Qwen2-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(modal_id)
        self.llm_model = AutoModelForCausalLM.from_pretrained(
            modal_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface",
        )

        # Image generation pipeline
        self.image_pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo",
            torch_dtype=torch.float16,
            variant="fp16",
            cache_dir="/.cache/huggingface"
        ).to("cuda")

        print("✅ All models loaded successfully.")

    # ------------------ FASTAPI ENDPOINT ------------------
    @modal.fastapi_endpoint(method="POST")
    def generate(self) -> GenerateMusicResponse:
        output_dir = "/tmp/output"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{uuid.uuid4()}.wav")

        prompt = "Cuban music, salsa, son, Afro-Cuban, traditional Cuban"
        lyrics = """[verse]
            Sun dips low the night ignites
            Bassline hums with gleaming lights
            Electric guitar singing tales so fine
            In the rhythm we all intertwine

            [verse]
            Drums beat steady calling out
            Percussion guides no room for doubt
            Electric pulse through every vein
            Dance away every ounce of pain

            [chorus]
            Feel the rhythm feel the flow
            Let the music take control
            Bassline deep electric hum
            In this night we're never numb

            [bridge]
            Stars above they start to glow
            Echoes of the night's soft glow
            Electric strings weave through the air
            In this moment none compare
        """

        try:
            print("🎵 Generating music with ACE-Step...")
            self.music_model(
                prompt=prompt,
                lyrics=lyrics,
                audio_duration=60,
                infer_step=40,
                guidance_scale=7,
                save_path=output_path
            )

            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                raise RuntimeError("Generated audio file missing or empty.")

            with open(output_path, "rb") as f:
                audio_bytes = f.read()

            audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
            os.remove(output_path)

            print("✅ Music generated successfully.")
            return GenerateMusicResponse(audio_data=audio_b64)

        except Exception as e:
            print("❌ Error during generation:", e)
            traceback.print_exc()
            return GenerateMusicResponse(audio_data="", error=str(e))


# ------------------ LOCAL ENTRYPOINT ------------------
@app.local_entrypoint()
def main():
    server = MusicGenServer()
    endpoint_url = server.generate.get_web_url()

    print(f"🎧 Calling modal endpoint: {endpoint_url}")
    response = requests.post(endpoint_url)

    try:
        response.raise_for_status()
        result = GenerateMusicResponse(**response.json())

        if result.error:
            print("❌ Generation failed:", result.error)
            return

        audio_bytes = base64.b64decode(result.audio_data)
        output_filename = "generated_music.wav"
        with open(output_filename, "wb") as f:
            f.write(audio_bytes)

        print(f"✅ Music saved as {output_filename}")

    except requests.exceptions.RequestException as e:
        print("❌ HTTP request failed:", e)
