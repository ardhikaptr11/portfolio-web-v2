import { updateSession } from "@/lib/supabase/proxy";
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from "next/server";
import { routing } from "./app/(root)/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const requestWithHeaders = new NextRequest(request, {
    headers: requestHeaders,
  });

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) return await updateSession(requestWithHeaders);

  const intlResponse = intlMiddleware(requestWithHeaders);

  const supabaseResponse = await updateSession(requestWithHeaders);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  intlResponse.headers.set('x-pathname', pathname);

  return intlResponse;
};


export const config = {
  matcher: [
    '/',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|webmanifest|txt|xml)$).*)",
  ],
};

export default proxy;