"use client";

import { useState } from "react";
import ScanForm from "./ScanForm";
import ResultCard from "./ResultCard";

type Result =
  | { unavailable: true }
  | {
      unavailable: false;
      abuseScore: number;
      totalReports: number;
      countryCode: string | null;
      isp: string | null;
      isWhitelisted: boolean;
      lastReportedAt: string | null;
    }
  | { error: string };

export default function IPReputationPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(target: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ip-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ScanForm
        label="Check an IP address's reputation"
        placeholder="e.g. 8.8.8.8"
        loading={loading}
        helpText="Looks up community-reported abuse for an IPv4 or IPv6 address."
        onSubmit={handleSubmit}
      />

      {result && "error" in result && (
        <ResultCard variant="danger" title={result.error} />
      )}

      {result && "unavailable" in result && result.unavailable && (
        <ResultCard variant="info" title="IP reputation checks are coming soon">
          This tool is being switched on shortly - check back soon.
        </ResultCard>
      )}

      {result && "unavailable" in result && !result.unavailable && (
        <ResultCard
          variant={
            result.abuseScore >= 50 ? "danger" : result.abuseScore > 0 ? "warn" : "safe"
          }
          title={
            result.abuseScore >= 50
              ? `High risk - ${result.abuseScore}% abuse confidence`
              : result.abuseScore > 0
                ? `Some reports - ${result.abuseScore}% abuse confidence`
                : "No abuse reports found"
          }
        >
          <ul className="space-y-1 text-xs">
            <li>Total reports (last 90 days): {result.totalReports}</li>
            {result.countryCode && <li>Country: {result.countryCode}</li>}
            {result.isp && <li>ISP: {result.isp}</li>}
            {result.lastReportedAt && <li>Last reported: {result.lastReportedAt}</li>}
          </ul>
        </ResultCard>
      )}
    </div>
  );
}
