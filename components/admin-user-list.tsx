"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";

interface AdminUserListProps {
  users: Profile[];
  adminId: string;
  showApproved?: boolean;
  showDenied?: boolean;
}

export default function AdminUserList({ users, adminId, showApproved, showDenied }: AdminUserListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRow 
          key={user.id} 
          user={user} 
          adminId={adminId}
          showApproved={showApproved}
          showDenied={showDenied}
        />
      ))}
    </div>
  );
}

function UserRow({ user, adminId, showApproved, showDenied }: { user: Profile; adminId: string; showApproved?: boolean; showDenied?: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAction = async (action: "approve" | "deny" | "revoke") => {
    setLoading(true);

    try {
      const updates: Partial<Profile> = {};
      
      if (action === "approve") {
        updates.access_status = "approved";
        updates.access_granted_at = new Date().toISOString();
        updates.access_granted_by = adminId;
      } else if (action === "deny") {
        updates.access_status = "denied";
      } else if (action === "revoke") {
        updates.access_status = "denied";
        updates.access_granted_at = null;
        updates.access_granted_by = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      router.refresh();
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: user.role === "admin" ? "user" : "admin" })
        .eq("id", user.id);

      if (error) throw error;

      router.refresh();
    } catch (err) {
      console.error("Error updating user role:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{user.full_name || "No name"}</p>
          {user.role === "admin" && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">{user.email}</p>
        {user.access_requested_at && (
          <p className="mt-1 text-xs text-gray-500">
            Requested: {new Date(user.access_requested_at).toLocaleDateString()}
          </p>
        )}
        {showApproved && user.access_granted_at && (
          <p className="text-xs text-gray-500">
            Approved: {new Date(user.access_granted_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {/* Pending users - show approve/deny */}
        {!showApproved && !showDenied && (
          <>
            <button
              onClick={() => handleAction("approve")}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("deny")}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Deny
            </button>
          </>
        )}

        {/* Approved users - show revoke and toggle admin */}
        {showApproved && (
          <>
            <button
              onClick={handleToggleAdmin}
              disabled={loading}
              className="rounded-lg border border-amber-500/30 px-3 py-2 text-sm font-medium text-amber-500 transition-colors hover:bg-amber-500/10 disabled:opacity-50"
            >
              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
            </button>
            <button
              onClick={() => handleAction("revoke")}
              disabled={loading}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              Revoke
            </button>
          </>
        )}

        {/* Denied users - show approve button */}
        {showDenied && (
          <button
            onClick={() => handleAction("approve")}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
}
