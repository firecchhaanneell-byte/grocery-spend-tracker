import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.BASIC_USER || "";
  const pass = process.env.BASIC_PASS || "";

  // если не заданы — не пускаем (чтобы не открыть сайт случайно)
  if (!user || !pass) return unauthorized();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const b64 = auth.slice("Basic ".length);
  let decoded = "";
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const [u, p] = decoded.split(":");
  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

// защищаем всё, кроме статики next
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};