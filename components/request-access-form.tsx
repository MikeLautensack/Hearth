"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RequestAccessFormProps {
  userId: string;
  userEmail: string;
  userName?: string;
  hasExistingProfile: boolean;
}

export default function RequestAccessForm({ userId, userEmail, userName, hasExistingProfile }: RequestAccessFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (hasExistingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update({
            access_status: "pending",
            access_requested_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: userEmail,
            full_name: userName || null,
            role: "user",
            access_status: "pending",
            access_requested_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      router.refresh();
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Failed to submit request. Please try again.");
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
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <p className="rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 text-white">
            {userEmail}
          </p>
        </div>

        {userName && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <p className="rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 text-white">
              {userName}
            </p>
          </div>
        )}

        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
          <h3 className="font-medium text-amber-500 mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Your request will be reviewed by an admin</li>
            <li>• Once approved, you&apos;ll have access to server info and mods</li>
            <li>• You&apos;ll be able to connect and play immediately</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-600 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Access"}
        </button>
      </form>
    </div>
  );
}
