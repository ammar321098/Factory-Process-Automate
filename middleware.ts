import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const locales = ["en", "ur"];
  const hasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // If no locale prefix, detect from cookie or fallback to default
  if (!hasLocale) {
    const userLocale =
      request.cookies.get("NEXT_LOCALE")?.value ||
      routing.defaultLocale ||
      "en";
    const url = new URL(`/${userLocale}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }

  // Let next-intl handle locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
