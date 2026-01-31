import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types";
import SignOutButton from "@/components/sign-out-button";
import RedeemCodeForm from "@/components/redeem-code-form";

export default async function GetAccess() {
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
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Get Access</h1>
            <p className="mt-2 text-gray-400">
              Enter your access code to join Mike&apos;s Valheim server.
            </p>
          </div>
          
          <RedeemCodeForm 
            userId={user.id} 
            userEmail={user.email || ""} 
            userName={user.user_metadata?.full_name} 
            hasExistingProfile={!!profile} 
          />

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have a code? Ask Mike for one!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
