"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTrainerPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function submit() {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create trainer");
        return;
      }
      router.push("/admin/trainers");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add Trainer</h1>
        <Link
          href="/admin/trainers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 max-w-xl">
        <div className="space-y-4">
          <Field label="Name *" value={name} onChange={setName} />
          <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <p className="text-xs text-muted-foreground">
            A unique <code className="font-mono">TRN-XXXXXX</code> code will be
            auto-generated.
          </p>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <button
            onClick={submit}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            {isPending ? "Creating…" : "Create Trainer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}
