import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types";
import SignOutButton from "@/components/sign-out-button";
import CopyableField from "@/components/copyable-field";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user profile from database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // If no profile exists or access is pending, redirect to get access page
  if (!profile) {
    redirect("/get-access");
  }

  if (profile.access_status === "pending") {
    redirect("/get-access");
  }

  if (profile.access_status === "denied") {
    return (
      <div className="min-h-screen bg-[#0c0c0c]">
        <Header user={user} profile={profile} />
        <main className="mx-auto max-w-4xl px-4 py-24">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="mt-4 text-2xl font-bold text-white">
              Access Denied
            </h1>
            <p className="mt-2 text-gray-400">
              Your access request was not approved. If you believe this is a
              mistake, please contact the server admin.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Server configuration - using environment variables
  const serverConfig = {
    server_host:
      process.env.VALHEIM_SERVER_HOST || "your-server-address.com:2456",
    server_password:
      process.env.VALHEIM_SERVER_PASSWORD || "your-server-password",
    discord_url:
      process.env.DISCORD_INVITE_URL || "https://discord.gg/your-invite",
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* <Header user={user} profile={profile} /> */}

      <main className="mx-auto max-w-4xl px-4 py-24">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          {/* <h1 className="text-3xl font-bold text-white md:text-4xl">
            Welcome, {profile.full_name || user.email?.split("@")[0]}!
          </h1> */}
          <p className="mt-2 text-gray-400">
            You have access to Mike&apos;s Hearth. Here&apos;s everything you
            need to join the server.
          </p>
        </div>

        {/* Server Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Server Address */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <svg
                  className="h-5 w-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">
                Server Address
              </h2>
            </div>
            <CopyableField value={serverConfig.server_host} label="Address" />
          </div>

          {/* Server Password */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <svg
                  className="h-5 w-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">
                Server Password
              </h2>
            </div>
            <CopyableField
              value={serverConfig.server_password}
              label="Password"
              isSecret
            />
          </div>

          {/* Discord */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/10">
                <svg
                  className="h-5 w-5 text-[#5865F2]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">
                Discord Server
              </h2>
            </div>
            <p className="mb-3 text-sm text-gray-400">
              Join our Discord to chat with other players and coordinate raids!
            </p>
            <a
              href={serverConfig.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752C4]"
            >
              Join Discord
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Mod Profile Code */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">
                Mod Profile Code
              </h2>
            </div>
            <p className="mb-3 text-sm text-gray-400">
              Copy this code and import it in r2modman to get all required mods.
            </p>
            <CopyableField
              value="019c11a7-45a4-0ece-06f8-10c05857c494"
              label="Profile Code"
            />
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Setup Instructions
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Install r2modman</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Download and install r2modman from{" "}
                  <a
                    href="https://thunderstore.io/package/ebkr/r2modman/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline"
                  >
                    Thunderstore
                  </a>
                  . This is the mod manager we use to keep all mods
                  synchronized.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Select Valheim</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Open r2modman and select Valheim as your game. Create a new
                  profile or use the default one.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Import Mod Profile</h3>
                <p className="mt-1 text-sm text-gray-400">
                  In r2modman, go to{" "}
                  <strong className="text-white">
                    Settings → Import → From code
                  </strong>{" "}
                  and paste the profile code from above. This will install all
                  required mods automatically.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white">Launch Valheim</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Click{" "}
                  <strong className="text-white">
                    &quot;Start Modded&quot;
                  </strong>{" "}
                  in r2modman to launch Valheim with all mods loaded.
                  <span className="mt-1 block text-amber-500">
                    Important: Always launch through r2modman, not Steam!
                  </span>
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                5
              </div>
              <div>
                <h3 className="font-semibold text-white">Join the Server</h3>
                <p className="mt-1 text-sm text-gray-400">
                  In the game menu, click{" "}
                  <strong className="text-white">Join Game → Join by IP</strong>
                  . Enter the server address and password from above.
                  You&apos;re in!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Troubleshooting</h2>
          <div className="space-y-4 text-sm text-gray-400">
            <div>
              <p className="font-medium text-white">
                Can&apos;t connect to server?
              </p>
              <p>
                Make sure you launched Valheim through r2modman and that all
                mods are enabled.
              </p>
            </div>
            <div>
              <p className="font-medium text-white">Mods not working?</p>
              <p>
                Try refreshing the mod list in r2modman and make sure BepInEx is
                installed.
              </p>
            </div>
            <div>
              <p className="font-medium text-white">Still having issues?</p>
              <p>
                Join our Discord and ask in the #help channel. We&apos;re happy
                to assist!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header({
  user,
  profile,
}: {
  user: { email?: string };
  profile: Profile;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2a] bg-[#0c0c0c]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-amber-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-xl font-bold text-white">Hearth</span>
        </Link>
        <div className="flex items-center gap-4">
          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-sm font-medium text-amber-500 transition-colors hover:bg-amber-500/10"
            >
              Admin
            </Link>
          )}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
