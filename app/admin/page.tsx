import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Profile, AccessCode } from "@/lib/types";
import SignOutButton from "@/components/sign-out-button";
import AdminUserList from "@/components/admin-user-list";
import GenerateCodeButton from "@/components/generate-code-button";
import AccessCodeList from "@/components/access-code-list";

export default async function Admin() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Only admins can access this page
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Get all users
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Get all access codes
  const { data: accessCodes } = await supabase
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false });

  const approvedUsers = allUsers?.filter(u => u.access_status === "approved") || [];
  const unusedCodes = accessCodes?.filter(c => !c.used_by) || [];
  const usedCodes = accessCodes?.filter(c => c.used_by) || [];

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2a2a] bg-[#0c0c0c]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <svg className="h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xl font-bold text-white">Hearth</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:border-amber-500/30 hover:text-amber-500"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="mt-2 text-gray-400">
            Manage access codes and users for Mike&apos;s Hearth.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-3xl font-bold text-amber-500">{unusedCodes.length}</p>
            <p className="text-sm text-gray-400">Unused Codes</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-3xl font-bold text-green-500">{approvedUsers.length}</p>
            <p className="text-sm text-gray-400">Approved Users</p>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-3xl font-bold text-blue-500">{usedCodes.length}</p>
            <p className="text-sm text-gray-400">Codes Used</p>
          </div>
        </div>

        {/* Generate Codes Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Access Codes</h2>
            <GenerateCodeButton adminId={user.id} />
          </div>
          
          {unusedCodes.length > 0 ? (
            <AccessCodeList codes={unusedCodes as AccessCode[]} />
          ) : (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-center text-gray-400">
              No unused codes. Generate some to share with new players!
            </div>
          )}
        </section>

        {/* Approved Users */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">Approved Users</h2>
          {approvedUsers.length > 0 ? (
            <AdminUserList users={approvedUsers as Profile[]} adminId={user.id} showApproved />
          ) : (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-center text-gray-400">
              No approved users yet
            </div>
          )}
        </section>

        {/* Used Codes */}
        {usedCodes.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">Used Codes</h2>
            <AccessCodeList codes={usedCodes as AccessCode[]} showUsed />
          </section>
        )}
      </main>
    </div>
  );
}
