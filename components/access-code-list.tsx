"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AccessCode } from "@/lib/types";

interface AccessCodeListProps {
  codes: AccessCode[];
  showUsed?: boolean;
}

export default function AccessCodeList({
  codes,
  showUsed,
}: AccessCodeListProps) {
  return (
    <div className="space-y-3">
      {codes.map((code) => (
        <CodeRow key={code.id} code={code} showUsed={showUsed} />
      ))}
    </div>
  );
}

function CodeRow({ code, showUsed }: { code: AccessCode; showUsed?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this code?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("access_codes")
        .delete()
        .eq("id", code.id);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Error deleting code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <code className="rounded bg-[#0c0c0c] px-3 py-1 font-mono text-lg text-amber-500">
            {code.code}
          </code>
          {showUsed && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
              Used
            </span>
          )}
          {code.used_by && (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
              Used by: {code.used_by_email}
            </span>
          )}
        </div>
        {code.note && <p className="mt-1 text-sm text-gray-500">{code.note}</p>}
        <p className="mt-1 text-xs text-gray-600">
          Created: {new Date(code.created_at).toLocaleDateString()}
          {showUsed && code.used_at && (
            <> · Used: {new Date(code.used_at).toLocaleDateString()}</>
          )}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            copied
              ? "border-green-500/30 text-green-500"
              : "border-[#2a2a2a] text-gray-400 hover:border-amber-500/30 hover:text-amber-500"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        {!showUsed && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
