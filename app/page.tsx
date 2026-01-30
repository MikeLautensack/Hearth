import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2a] bg-[#0c0c0c]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xl font-bold text-white">Hearth</span>
          </div>
          <nav>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          {/* Background glow effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Modded Valheim Server
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Mike&apos;s Hearth
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 md:text-xl">
              Join our modded Valheim adventure! Request access to get the server details, 
              mod pack, and everything you need to start your Viking journey with friends.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Link
                  href="/dashboard"
                  className="group flex h-12 items-center gap-2 rounded-lg bg-amber-600 px-8 text-base font-semibold text-white transition-all hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  Go to Dashboard
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="group flex h-12 items-center gap-2 rounded-lg bg-amber-600 px-8 text-base font-semibold text-white transition-all hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  Request Access
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
              <a
                href="#features"
                className="flex h-12 items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-8 text-base font-medium text-white transition-colors hover:border-amber-500/50 hover:bg-[#2a2a2a]"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
            What You Get
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Server Access</h3>
              <p className="text-gray-400">
                Get the server address and password to connect directly to our modded world.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Mod Pack</h3>
              <p className="text-gray-400">
                Easy r2modman profile import with all the mods pre-configured and ready to go.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Discord Community</h3>
              <p className="text-gray-400">
                Join our Discord to coordinate raids, share builds, and hang out with fellow Vikings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Setup Guide</h3>
              <p className="text-gray-400">
                Step-by-step instructions to get you from zero to Viking in minutes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Private Server</h3>
              <p className="text-gray-400">
                Password-protected server with admin approval to keep the community friendly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all hover:border-amber-500/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Always Updated</h3>
              <p className="text-gray-400">
                Mods kept up-to-date with the latest Valheim patches and new features.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-[#2a2a2a] bg-[#1a1a1a]/50 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Join the Adventure?
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Sign in with Google and request access. Once approved, you&apos;ll have everything you need to start playing.
            </p>
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-amber-600 px-8 text-base font-semibold text-white transition-all hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-500/25"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-amber-600 px-8 text-base font-semibold text-white transition-all hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-500/25"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
          <p>Mike&apos;s Hearth - A Modded Valheim Server</p>
        </div>
      </footer>
    </div>
  );
}
