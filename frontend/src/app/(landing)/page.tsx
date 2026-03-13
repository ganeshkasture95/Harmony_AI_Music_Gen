import {
  ArrowRight,
  Music,
  Sparkles,
  Wand2,
  Zap,
  Headphones,
  Play,
  Star,
  Users,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import PublishedSongsFetcher from "~/components/home/published-songs-fetcher";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">HarmonyAI</span>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "Trending", href: "#trending" },
              { label: "Tips", href: "#tips" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link href="/auth/sign-in">Log in</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-up">
                Get started
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by ACE-Step AI · Now in Beta
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-[80px] lg:leading-[1.05]">
            Create music that
            <br />
            <span className="text-primary">sounds like you.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            HarmonyAI turns your ideas, lyrics, and moods into professional‑quality
            songs in minutes — no studio, no instruments, no experience required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-up">
                Start creating for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-8 text-base">
              <Link href="/auth/sign-in">
                <Play className="h-4 w-4 fill-current" />
                Log in
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Publish & share
            </span>
          </div>
        </div>

        {/* ── App mockup ──────────────────────────────────────── */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Gradient fade on bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/60">
            {/* Fake window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-card/80 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <div className="ml-4 flex-1 rounded-md bg-muted/60 py-1 px-3 text-xs text-muted-foreground">
                app.harmonyai.io/create
              </div>
            </div>
            {/* Fake dashboard UI */}
            <div className="flex h-[340px] md:h-[400px]">
              {/* Sidebar */}
              <div className="hidden w-52 flex-shrink-0 flex-col border-r border-border/60 bg-sidebar p-4 md:flex">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                    <Music className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-bold">HarmonyAI</span>
                </div>
                {["Discover", "Create", "My Songs", "Settings"].map((item, i) => (
                  <div
                    key={item}
                    className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-xs ${
                      i === 1
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    {item}
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="flex-1 overflow-hidden p-5">
                <p className="mb-4 text-sm font-semibold text-foreground">Generate a New Track</p>
                {/* Fake form */}
                <div className="mb-3 rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                  Upbeat electronic dance music with synth leads, 128 BPM, festival vibes...
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {["Pop", "Electronic", "Hip-Hop", "Jazz", "Classical", "R&B"].map((g) => (
                    <div
                      key={g}
                      className={`rounded-full border px-3 py-1 text-center text-xs ${
                        g === "Electronic"
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      {g}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 flex-1 rounded-lg bg-primary/20 text-xs flex items-center justify-center text-primary font-medium gap-1.5">
                    <Wand2 className="h-3.5 w-3.5" />
                    Generate Song
                  </div>
                </div>
                {/* Fake track list */}
                <div className="mt-5 space-y-2">
                  {[
                    { title: "Neon Horizons", genre: "Electronic", dur: "3:42" },
                    { title: "Ocean Drive", genre: "Pop", dur: "4:05" },
                  ].map((t) => (
                    <div
                      key={t.title}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/20">
                        <Play className="h-3.5 w-3.5 fill-primary text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.genre}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{t.dur}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted-by bar ─────────────────────────────────────── */}
      <section className="border-y border-border/40 bg-card/30 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Built on world-class AI infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground/50">
            {["Modal Labs", "Hugging Face", "AWS S3", "ACE-Step", "Neon DB"].map((brand) => (
              <span key={brand} className="text-sm font-semibold tracking-wide">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Why HarmonyAI
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Everything you need to create
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete studio in your browser — powered by state‑of‑the‑art AI.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-5 w-5 text-primary" />,
                title: "Lightning Fast",
                desc: "Songs generated in under 90 seconds. Go from idea to finished track before your coffee cools.",
              },
              {
                icon: <Wand2 className="h-5 w-5 text-primary" />,
                title: "No Experience Needed",
                desc: "Describe your vision in plain language. The AI handles melody, harmony, arrangement, and mix.",
              },
              {
                icon: <Headphones className="h-5 w-5 text-primary" />,
                title: "Studio-Grade Audio",
                desc: "High-fidelity WAV output ready for streaming platforms, podcasts, or your next project.",
              },
              {
                icon: <Globe className="h-5 w-5 text-primary" />,
                title: "Publish & Share",
                desc: "Publish to the community with one click. Get listens, likes, and real feedback.",
              },
              {
                icon: <Star className="h-5 w-5 text-primary" />,
                title: "Custom Lyrics",
                desc: "Write your own lyrics or let the AI compose them. Full creative control, always.",
              },
              {
                icon: <Users className="h-5 w-5 text-primary" />,
                title: "Community",
                desc: "Discover songs from creators worldwide. Get inspired and iterate on what works.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card/80"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Songs ─────────────────────────────────────── */}
      <section id="trending" className="bg-card/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Community
              </p>
              <h2 className="text-4xl font-bold tracking-tight">Trending now</h2>
              <p className="mt-2 text-muted-foreground">
                Discover the most-played AI‑generated songs this week
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-1.5">
              <Link href="/auth/sign-up">
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <PublishedSongsFetcher />
        </div>
      </section>

      {/* ── Tips ───────────────────────────────────────────────── */}
      <section id="tips" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Pro Tips
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Create better songs</h2>
            <p className="mt-4 text-muted-foreground">
              Small tweaks that make a big difference in output quality
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-2">
            {[
              {
                num: "01",
                title: "Be Specific with Prompts",
                desc: 'Instead of "happy song", write "upbeat 128 BPM electronic track with synth leads and a festival crowd vibe". Precision yields precision.',
              },
              {
                num: "02",
                title: "Combine Description + Lyrics",
                desc: 'Use "Described Lyrics" mode to feed both a musical style description and your own lyric lines. The AI fuses both perfectly.',
              },
              {
                num: "03",
                title: "Tune the Settings",
                desc: "Raise the guidance scale for a more faithful result. More inference steps improve detail — great for intricate compositions.",
              },
              {
                num: "04",
                title: "Iterate Freely",
                desc: "Every generation uses a different random seed. Run it several times, pick your favourite, then refine with tweaked prompts.",
              },
            ].map((tip) => (
              <div key={tip.num} className="bg-background p-8 hover:bg-card/60 transition-colors">
                <span className="mb-4 block text-3xl font-black text-primary/30">
                  {tip.num}
                </span>
                <h3 className="mb-2 font-semibold">{tip.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 p-12 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[80px]" />
          </div>
          <p className="relative mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Get Started Today
          </p>
          <h2 className="relative mb-4 text-4xl font-bold tracking-tight">
            Your next hit is one prompt away.
          </h2>
          <p className="relative mb-8 text-muted-foreground">
            Join the HarmonyAI community and start creating music that moves people.
          </p>
          <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 bg-primary px-10 text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-up">
                Create your first song
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-10">
              <Link href="/auth/sign-in">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Music className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">HarmonyAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered music generation for everyone. Create, share, and discover.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Product
              </p>
              <ul className="space-y-2">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Trending", href: "#trending" },
                  { label: "Create", href: "/auth/sign-up" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Account
              </p>
              <ul className="space-y-2">
                {[
                  { label: "Sign up", href: "/auth/sign-up" },
                  { label: "Log in", href: "/auth/sign-in" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Company
              </p>
              <ul className="space-y-2">
                {[{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HarmonyAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Made with ♪ and AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
