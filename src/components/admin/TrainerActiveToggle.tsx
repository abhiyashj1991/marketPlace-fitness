"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  trainerId: string;
  initialActive: boolean;
};

export function TrainerActiveToggle({ trainerId, initialActive }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    const next = !active;
    setActive(next); // optimistic
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/trainers/${trainerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: next }),
        });
        if (!res.ok) {
          setActive(!next); // rollback
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Update failed");
          return;
        }
        router.refresh();
      } catch {
        setActive(!next);
        setError("Network error");
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={isPending}
        title={active ? "Click to deactivate" : "Click to activate"}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors",
          active
            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          isPending && "opacity-60"
        )}
      >
        {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
        {active ? "Active" : "Inactive"}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
