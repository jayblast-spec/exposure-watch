const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /^[0-9a-fA-F:]+:[0-9a-fA-F:]+$/;

export async function POST(request: Request) {
  let target: string | undefined;
  try {
    const body = await request.json();
    target = typeof body?.target === "string" ? body.target.trim() : undefined;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!target) {
    return Response.json({ error: "Enter an IP address." }, { status: 400 });
  }

  if (!IPV4_RE.test(target) && !IPV6_RE.test(target)) {
    return Response.json(
      { error: "Enter a valid IPv4 or IPv6 address (domain lookups coming soon)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) {
    return Response.json({ unavailable: true });
  }

  try {
    const res = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(target)}&maxAgeInDays=90`,
      {
        headers: {
          Key: apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Reputation lookup failed. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const d = data?.data ?? {};

    return Response.json({
      unavailable: false,
      abuseScore: d.abuseConfidenceScore ?? 0,
      totalReports: d.totalReports ?? 0,
      countryCode: d.countryCode ?? null,
      isp: d.isp ?? null,
      isWhitelisted: Boolean(d.isWhitelisted),
      lastReportedAt: d.lastReportedAt ?? null,
    });
  } catch {
    return Response.json(
      { error: "Reputation lookup failed. Try again shortly." },
      { status: 502 }
    );
  }
}
