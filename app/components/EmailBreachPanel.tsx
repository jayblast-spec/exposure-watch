"use client";

import { useState } from "react";
import ScanForm from "./ScanForm";
import ResultCard from "./ResultCard";
import ActionChecklist from "./ActionChecklist";

type Breach = { name: string; date: string; exposedData: string[] };
type Result =
  | { found: false; breaches: [] }
  | { found: true; breaches: Breach[] }
  | { error: string };

export default function EmailBreachPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(email: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/breach-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const tips: string[] = [];
  if (result && "found" in result && result.found) {
    for (const breach of result.breaches) {
      tips.push(`Change your password for ${breach.name} if you haven't already.`);
    }
    tips.push("Turn on two-factor authentication wherever it's offered.");
    tips.push("Use a password manager so every account has a unique password.");
  }

  return (
    <div className="flex flex-col gap-4">
      <ScanForm
        label="Check your email for known breaches"
        placeholder="you@example.com"
        inputType="email"
        loading={loading}
        helpText="We only check public breach records - your email is not stored."
        onSubmit={handleSubmit}
      />

      {result && "error" in result && (
        <ResultCard variant="danger" title={result.error} />
      )}

      {result && "found" in result && !result.found && (
        <ResultCard variant="safe" title="No known breaches found for this email" />
      )}

      {result && "found" in result && result.found && (
        <ResultCard
          variant="warn"
          title={`Found in ${result.breaches.length} breach${
            result.breaches.length === 1 ? "" : "es"
          }`}
        >
          <ul className="space-y-2">
            {result.breaches.map((b, i) => (
              <li key={i} className="flex flex-col">
                <span className="font-medium text-foreground">
                  {b.name} <span className="text-muted">- {b.date}</span>
                </span>
                {b.exposedData.length > 0 && (
                  <span className="text-xs text-muted">
                    Exposed: {b.exposedData.join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {tips.length > 0 && <ActionChecklist items={tips} />}
    </div>
  );
}
