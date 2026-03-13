import { ArrowRight, Music, Sparkles, TrendingUp, Wand2, Zap, Users, Headphones } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import PublishedSongsFetcher from "~/components/home/published-songs-fetcher";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/lib/auth";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is already logged in, redirect to home page
  if (session) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] via-[#1a0a3e] to-[#15162c]">
      {/* Navigation Bar */}
      <nav className="border-b border-purple-500/20 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">HarmonyAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-purple-500/10">
              <Link href="/auth/sign-in">Log In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Music Generation</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Create Music with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 sm:text-xl">
              Transform your ideas into professional-quality music in minutes. Generate lyrics, 
              compose melodies, and create original tracks with the power of AI. No musical 
              experience required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                <Link href="/auth/sign-in">Log In</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              No credit card required • Start creating in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Why Choose HarmonyAI?
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to create amazing music with AI
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate complete songs in minutes, not hours. Our AI-powered system creates 
                  professional-quality music at incredible speed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Easy to Use</CardTitle>
                <CardDescription className="text-gray-400">
                  No musical training needed. Simply describe your vision or provide lyrics, 
                  and let AI handle the rest. Create like a professional composer.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-teal-500">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">High Quality</CardTitle>
                <CardDescription className="text-gray-400">
                  Professional-grade audio output ready for streaming, podcasts, or your 
                  next creative project. Studio-quality sound every time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Songs Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Trending Songs
            </h2>
            <p className="text-lg text-gray-400">
              Discover the most popular AI-generated music from our community
            </p>
          </div>
          <PublishedSongsFetcher />
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Create Better Songs
            </h2>
            <p className="text-lg text-gray-400">
              Tips and tricks to get the most out of HarmonyAI
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Be Specific with Prompts</CardTitle>
                <CardDescription className="text-gray-400">
                  Instead of &quot;happy song&quot;, try &quot;upbeat electronic dance music with synth leads 
                  and a driving bassline, 128 BPM, festival vibes&quot;. The more details you provide, 
                  the better the AI can understand your vision.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Use Custom Lyrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Write your own lyrics or describe the emotional tone you want. The AI will 
                  generate music that perfectly matches the mood and rhythm of your words, 
                  creating a cohesive and meaningful composition.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-orange-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Experiment with Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Adjust guidance scale, inference steps, and audio duration to fine-tune your 
                  results. Higher guidance scale creates more focused outputs, while more 
                  inference steps can improve quality at the cost of generation time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-teal-500">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Combine Description & Lyrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Use the &quot;Described Lyrics&quot; mode to provide both a musical description and 
                  lyrical content. This gives the AI the most context to create a song that 
                  matches both your musical and lyrical vision.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-red-500">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Try Instrumental Versions</CardTitle>
                <CardDescription className="text-gray-400">
                  Create instrumental tracks for background music, podcasts, or as a base for 
                  your own vocals. Instrumental mode generates pure musical compositions without 
                  any vocal elements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Iterate and Refine</CardTitle>
                <CardDescription className="text-gray-400">
                  Don&apos;t be afraid to generate multiple versions with different seeds or settings. 
                  Each generation is unique, and experimenting helps you discover the perfect 
                  sound for your project.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to Create Your Masterpiece?
              </h2>
              <p className="mb-8 text-lg text-gray-300">
                Join thousands of creators making music with AI. Start your musical journey today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/auth/sign-up" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                  <Link href="/auth/sign-in">Log In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-400" />
              <span className="text-lg font-semibold text-white">HarmonyAI</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} HarmonyAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Link href="/auth/sign-in">Log In</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
