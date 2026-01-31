"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface GenerateCodeButtonProps {
  adminId: string;
}

// Generate a random 8-character code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing characters like 0, O, 1, I
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function GenerateCodeButton({ adminId }: GenerateCodeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [count, setCount] = useState(1);
  const router = useRouter();
  const supabase = createClient();

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const codes = [];
      for (let i = 0; i < count; i++) {
        codes.push({
          code: generateCode(),
          created_by: adminId,
          note: note.trim() || null,
        });
      }

      const { error } = await supabase
        .from("access_codes")
        .insert(codes);

      if (error) throw error;

      setShowModal(false);
      setNote("");
      setCount(1);
      router.refresh();
    } catch (err) {
      console.error("Error generating codes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
      >
        Generate Codes
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Generate Access Codes</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-400 mb-2">
                  Number of codes
                </label>
                <input
                  type="number"
                  id="count"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., For Discord giveaway"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-[#2a2a2a] py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 rounded-lg bg-amber-600 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "Generating..." : `Generate ${count} Code${count > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
