import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types";
import SignOutButton from "@/components/sign-out-button";
import RequestAccessForm from "@/components/request-access-form";

export default async function RequestAccess() {
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

  // If user is already approved, redirect to dashboard
  if (profile?.access_status === "approved") {
    redirect("/dashboard");
  }

  const hasPendingRequest = profile?.access_status === "pending";
  const wasDenied = profile?.access_status === "denied";

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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-24">
        {hasPendingRequest ? (
          /* Pending Status */
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
              <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Access Request Pending</h1>
            <p className="mt-2 text-gray-400">
              Your request to join Mike&apos;s Hearth is being reviewed. You&apos;ll gain access once an admin approves your request.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Requested on {profile?.access_requested_at ? new Date(profile.access_requested_at).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        ) : wasDenied ? (
          /* Denied Status - Can request again */
          <div className="space-y-6">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Previous Request Denied</h1>
              <p className="mt-2 text-gray-400">
                Your previous access request was not approved. You can submit a new request below.
              </p>
            </div>
            
            <RequestAccessForm userId={user.id} userEmail={user.email || ""} userName={user.user_metadata?.full_name} hasExistingProfile={true} />
          </div>
        ) : (
          /* New Request */
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Request Access</h1>
              <p className="mt-2 text-gray-400">
                Submit a request to join Mike&apos;s modded Valheim server.
              </p>
            </div>
            
            <RequestAccessForm userId={user.id} userEmail={user.email || ""} userName={user.user_metadata?.full_name} hasExistingProfile={!!profile} />
          </div>
        )}
      </main>
    </div>
  );
}
