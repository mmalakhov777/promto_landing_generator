import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:8000";

async function proxyRequest(request: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = new URL(`${API_URL}/api/v1/${targetPath}`);

  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, params);
}