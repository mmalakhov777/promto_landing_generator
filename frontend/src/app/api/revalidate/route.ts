import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ detail: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag, "max");
  } else {
    // Revalidate all main tags
    revalidateTag("landings", "max");
    revalidateTag("categories", "max");
    revalidateTag("settings", "max");
    revalidateTag("sitemap", "max");
  }

  return NextResponse.json({ revalidated: true, tag: tag || "all" });
}
