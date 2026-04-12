"use client";

import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";

const STORAGE_KEY = "marketplace-fitness-trainer-ref";

type TrainerInfo = { code: string; name: string };

/**
 * Reads `?ref=TRN-XXXXXX` from the URL once on mount, validates it via the API,
 * and stores it in localStorage so the discount persists across the
 * customer's session (browse -> cart -> checkout). The banner is shown
 * on every page until the user dismisses it OR the order is placed.
 *
 * Reads from window.location.search (not useSearchParams) to avoid forcing
 * dynamic rendering on every static page that uses the layout.
 *
 * The checkout page reads the same localStorage key to pre-fill the
 * trainer code field.
 */
export function TrainerRefBanner() {
  const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refParam = new URLSearchParams(window.location.search).get("ref");

    async function validateAndStore(code: string) {
      try {
        const res = await fetch(
          `/api/trainer-code/${encodeURIComponent(code.trim().toUpperCase())}`
        );
        const data = await res.json();
        if (!cancelled && data.valid) {
          const info: TrainerInfo = {
            code: data.trainer.code,
            name: data.trainer.name,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
          setTrainer(info);
        }
      } catch {
        // silent — invalid ref just won't apply
      }
    }

    if (refParam) {
      validateAndStore(refParam);
      return () => {
        cancelled = true;
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTrainer(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.removeItem(STORAGE_KEY);
    setTrainer(null);
  }

  if (!trainer || dismissed) return null;

  return (
    <div className="bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 text-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Award className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            Recommended by <strong>{trainer.name}</strong> — 10% off applied at checkout
            <span className="hidden sm:inline ml-1 font-mono text-emerald-100">
              ({trainer.code})
            </span>
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1 hover:bg-emerald-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export const TRAINER_REF_STORAGE_KEY = STORAGE_KEY;
