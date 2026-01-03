import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes/filter'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSessionServer();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookiesArr) {
          const parsed = parse(cookieStr);

          const options = {
            path: parsed.Path ?? '/',
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          };

          if (parsed.accessToken) {
            response.cookies.set('accessToken', parsed.accessToken, options);
          }

          if (parsed.refreshToken) {
            response.cookies.set('refreshToken', parsed.refreshToken, options);
          }
        }

        return response;
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/filter/:path*', '/sign-in', '/sign-up'],
};
