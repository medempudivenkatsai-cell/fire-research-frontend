import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const range = req.headers.get("range") || undefined;

  try {
    const upstream = await fetch(url, {
      headers: range ? { range } : undefined,
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed: ${upstream.status}`, upstreamUrl: url },
        { status: 502 }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "application/pdf");
    headers.set("Cache-Control", "no-store");

    // Forward headers PDF viewers rely on
    const acceptRanges = upstream.headers.get("accept-ranges");
    const contentRange = upstream.headers.get("content-range");
    const contentLength = upstream.headers.get("content-length");

    if (acceptRanges) headers.set("accept-ranges", acceptRanges);
    if (contentRange) headers.set("content-range", contentRange);
    if (contentLength) headers.set("content-length", contentLength);

    return new Response(upstream.body, {
      status: upstream.status, // 200 or 206
      headers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Proxy error" }, { status: 500 });
  }
}
