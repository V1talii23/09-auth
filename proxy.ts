import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';
import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes/filter'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoutes = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoutes = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (accessToken) {
    if (isPublicRoutes) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    const data = await checkSessionServer();
    const setCookie = data.headers['set-cookie'];

    if (setCookie) {
      const response = isPublicRoutes
        ? NextResponse.redirect(new URL('/', req.url))
        : NextResponse.next();

      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.path,
          MaxAge: Number(parsed['Max-Age']),
        };

        if (parsed.accessToken)
          cookieStore.set('accessToken', parsed.accessToken, options);

        if (parsed.refreshToken)
          cookieStore.set('refreshToken', parsed.refreshToken, options);
      }

      return response;
    }

    if (isPrivateRoutes) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
  }

  if (isPrivateRoutes) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/filter/:path*', '/sign-in', '/sign-up'],
};
