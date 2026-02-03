import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-900/30 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <HearthIcon className="h-7 w-7 text-amber-600" />
            <span className="text-lg font-semibold text-amber-100">Hearth</span>
          </Link>
          <nav>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded border border-amber-700/50 bg-amber-900/30 px-3 py-1.5 text-sm text-amber-200 hover:bg-amber-800/40"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="rounded border border-amber-700/50 bg-amber-900/30 px-3 py-1.5 text-sm text-amber-200 hover:bg-amber-800/40"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero - Valheim vibe */}
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4">
          {/* Subtle campfire glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-[20%] left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-600/15 blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Wooden frame / rune-style decoration */}
            <div className="mb-8 flex items-center gap-6 text-amber-800/60">
              <WoodDivider className="h-8 w-16" />
              <RuneIcon className="h-10 w-10" />
              <WoodDivider className="h-8 w-16" />
            </div>

            {/* Main art: hearth + title */}
            <div className="mb-8">
              <HearthIllustration className="h-32 w-32 text-amber-600/90 md:h-40 md:w-40" />
            </div>

            <h1 className="mb-3 text-3xl font-bold text-amber-50 md:text-4xl">
              Mike&apos;s Hearth
            </h1>
            <p className="mb-2 max-w-md text-amber-200/80">
              A modded Valheim server. Get an access code from Mike, sign in,
              and you&apos;re in.
            </p>
            <p className="mb-10 text-sm text-amber-900/80">
              Server info, mod pack, Discord — all in one place once you&apos;ve
              got access.
            </p>

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-amber-700 px-6 py-2.5 text-amber-100 hover:bg-amber-600"
              >
                Go to dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg bg-amber-700 px-6 py-2.5 text-amber-100 hover:bg-amber-600"
              >
                Sign in to get access
              </Link>
            )}
            {!user && (
              <p className="mt-4 text-xs text-amber-800/70">
                Need a code? Ask Mike.
              </p>
            )}
          </div>
        </section>

        {/* Simple footer */}
        <footer className="border-t border-amber-900/20 py-6">
          <div className="mx-auto max-w-4xl px-4 text-center text-xs text-amber-900/60">
            Modded Valheim · Just for fun
          </div>
        </footer>
      </main>
    </div>
  );
}

function HearthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function HearthIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Stone circle / hearth base */}
      <ellipse
        cx="60"
        cy="88"
        rx="42"
        ry="8"
        className="fill-amber-950/40 stroke-amber-800/50"
      />
      <path d="M25 78 Q60 70 95 78" className="stroke-amber-800/60" />
      <path d="M28 82 Q60 76 92 82" className="stroke-amber-900/50" />
      {/* Logs */}
      <path d="M35 75 L55 62" className="stroke-amber-800" />
      <path d="M50 68 L75 58" className="stroke-amber-800" />
      <path d="M65 62 L88 72" className="stroke-amber-800" />
      <path d="M42 72 L62 65" className="stroke-amber-700" />
      <path d="M58 66 L82 70" className="stroke-amber-700" />
      {/* Flames */}
      <path
        d="M48 68 Q52 52 56 68 Q60 48 64 68 Q68 56 72 68"
        className="fill-amber-500/30 stroke-amber-500"
      />
      <path
        d="M52 65 Q55 55 58 65 Q61 50 64 65 Q67 58 70 65"
        className="fill-amber-400/20 stroke-amber-400"
      />
      {/* Ember glow */}
      <circle
        cx="60"
        cy="62"
        r="18"
        className="fill-amber-600/10 stroke-none"
      />
    </svg>
  );
}

function RuneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18M4 8h16M4 16h16M8 4v16M16 4v16" />
      <path
        d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z"
        className="stroke-amber-700/80"
      />
    </svg>
  );
}

function WoodDivider({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M0 16h8M12 16h6M22 16h6M34 16h6M44 16h6M54 16h8" />
      <path d="M4 12v8M20 12v8M36 12v8M52 12v8" />
    </svg>
  );
}
