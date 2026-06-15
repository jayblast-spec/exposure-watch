const PREFIX_RE = /^[0-9A-Fa-f]{5}$/;
const SUFFIX_RE = /^[0-9A-Fa-f]{35}$/;

export async function POST(request: Request) {
  let prefix: string | undefined;
  let suffix: string | undefined;
  try {
    const body = await request.json();
    prefix = typeof body?.prefix === "string" ? body.prefix.trim() : undefined;
    suffix = typeof body?.suffix === "string" ? body.suffix.trim().toUpperCase() : undefined;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!prefix || !PREFIX_RE.test(prefix) || !suffix || !SUFFIX_RE.test(suffix)) {
    return Response.json({ error: "Invalid hash format." }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix.toUpperCase()}`, {
      headers: { "Add-Padding": "true" },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Password check service is unavailable right now. Try again shortly." },
        { status: 502 }
      );
    }

    const text = await res.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [lineSuffix, countStr] = line.trim().split(":");
      if (lineSuffix?.toUpperCase() === suffix) {
        const count = parseInt(countStr, 10) || 0;
        return Response.json({ pwned: count > 0, count });
      }
    }

    return Response.json({ pwned: false, count: 0 });
  } catch {
    return Response.json(
      { error: "Password check service is unavailable right now. Try again shortly." },
      { status: 502 }
    );
  }
}
