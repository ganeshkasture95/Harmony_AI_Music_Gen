from pydantic import BaseModel


class AudioGenerationBase(BaseModel):
    audio_duration: float = 180.0  # in seconds
    seed:int = -1
    guidance_scale: float = 15.0
    infer_step: int = 60
    insturemental: bool = False