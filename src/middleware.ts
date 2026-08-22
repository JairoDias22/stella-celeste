import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "stella_admin_session";
const CLIENTE_COOKIE = "stella_cliente_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const key = getSecretKey();
  if (!key) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protege o painel administrativo (exceto a própria tela de login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const valid = await isValidSession(token);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protege a área do cliente
  if (pathname.startsWith("/minha-conta") || pathname.startsWith("/agendar")) {
    const token = request.cookies.get(CLIENTE_COOKIE)?.value;
    const valid = await isValidSession(token);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/minha-conta/:path*", "/agendar/:path*"],
};
