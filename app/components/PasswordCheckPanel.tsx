"use client";

import { useState } from "react";
import ScanForm from "./ScanForm";
import ResultCard from "./ResultCard";
import ActionChecklist from "./ActionChecklist";

type Result = { pwned: boolean; count: number } | { error: string };

async function sha1Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export default function PasswordCheckPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(password: string) {
    setLoading(true);
    setResult(null);
    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      const res = await fetch("/api/password-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix, suffix }),
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
  if (result && "pwned" in result && result.pwned) {
    tips.push("Stop using this password anywhere - switch to a unique one per account.");
    tips.push("Use a password manager to generate and store strong passwords.");
    tips.push("Enable two-factor authentication on accounts that used this password.");
  }

  return (
    <div className="flex flex-col gap-4">
      <ScanForm
        label="Check if a password has appeared in a breach"
        placeholder="Enter a password"
        inputType="password"
        loading={loading}
        helpText="Your password is hashed in your browser - only part of the hash is ever sent."
        onSubmit={handleSubmit}
      />

      {result && "error" in result && (
        <ResultCard variant="danger" title={result.error} />
      )}

      {result && "pwned" in result && !result.pwned && (
        <ResultCard variant="safe" title="This password was not found in any known breach" />
      )}

      {result && "pwned" in result && result.pwned && (
        <ResultCard
          variant="danger"
          title={`This password has been seen ${result.count.toLocaleString()} time${
            result.count === 1 ? "" : "s"
          } in data breaches`}
        />
      )}

      {tips.length > 0 && <ActionChecklist items={tips} />}
    </div>
  );
}
