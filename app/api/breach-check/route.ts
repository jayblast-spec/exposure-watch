const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Breach = {
  name: string;
  date: string;
  exposedData: string[];
};

export async function POST(request: Request) {
  let email: string | undefined;
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : undefined;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
      { headers: { Accept: "application/json" } }
    );

    if (res.status === 404) {
      return Response.json({ found: false, breaches: [] });
    }

    if (!res.ok) {
      return Response.json(
        { error: "Breach lookup service is unavailable right now. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await res.json();

    const details: unknown[] = data?.ExposedBreaches?.breaches_details ?? [];

    if (!Array.isArray(details) || details.length === 0) {
      return Response.json({ found: false, breaches: [] });
    }

    const breaches: Breach[] = details.map((entry) => {
      const d = entry as Record<string, unknown>;
      const exposedData =
        typeof d.xposed_data === "string"
          ? d.xposed_data.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
      return {
        name: typeof d.breach === "string" ? d.breach : "Unknown",
        date: typeof d.xposed_date === "string" ? d.xposed_date : "Unknown date",
        exposedData,
      };
    });

    return Response.json({ found: true, breaches });
  } catch {
    return Response.json(
      { error: "Breach lookup service is unavailable right now. Try again shortly." },
      { status: 502 }
    );
  }
}
