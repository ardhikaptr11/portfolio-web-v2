import { updateSession } from "@/lib/supabase/proxy";
import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from "next/server";
import { routing } from "./app/(root)/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) return await updateSession(request);

  const intlResponse = intlMiddleware(request);

  const supabaseResponse = await updateSession(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;