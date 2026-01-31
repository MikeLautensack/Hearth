"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RedeemCodeFormProps {
  userId: string;
  userEmail: string;
  userName?: string;
  hasExistingProfile: boolean;
}

export default function RedeemCodeForm({
  userId,
  userEmail,
  userName,
  hasExistingProfile,
}: RedeemCodeFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = code.trim().toUpperCase(); // Codes are uppercase

    if (!trimmedCode) {
      setError("Please enter an access code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if the code exists and is not used
      const { data: accessCode, error: codeError } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", trimmedCode)
        .single();

      if (codeError || !accessCode) {
        setError("Invalid access code. Please check and try again.");
        setLoading(false);
        return;
      }

      if (accessCode.used_by) {
        setError("This access code has already been used.");
        setLoading(false);
        return;
      }

      // Create or update profile FIRST (before marking code as used)
      // This is required because access_codes.used_by has a foreign key to profiles
      if (hasExistingProfile) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            access_status: "approved",
            access_granted_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          setError("Failed to update profile. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          email: userEmail,
          full_name: userName || null,
          role: "user",
          access_status: "approved",
          access_granted_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating profile:", insertError);
          setError("Failed to create profile. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Now mark the code as used (profile exists, so FK constraint is satisfied)
      const { error: redeemError } = await supabase
        .from("access_codes")
        .update({
          used_by: userId,
          used_at: new Date().toISOString(),
          used_by_email: userEmail,
        })
        .eq("id", accessCode.id)
        .is("used_by", null);

      if (redeemError) {
        console.error("Error marking code as used:", redeemError);
        // Profile was created but code wasn't marked - not ideal but user has access
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Error redeeming code:", err);
      setError("Failed to redeem code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Access Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your access code"
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            autoComplete="off"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-600 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Redeem Code"}
        </button>
      </form>
    </div>
  );
}
