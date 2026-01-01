import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';
import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes/filter'];
const publicRoutes = ['/sigh-in', '/sigh-up'];

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

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSessionServer();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
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

        if (isPublicRoutes) {
          return NextResponse.redirect(new URL('/', req.url), {
            headers: { Cookie: cookieStore.toString() },
          });
        }

        if (isPrivateRoutes) {
          return NextResponse.next({
            headers: { Cookie: cookieStore.toString() },
          });
        }
      }
    }
    if (isPublicRoutes) {
      return NextResponse.next();
    }

    if (isPrivateRoutes) {
      return NextResponse.redirect(new URL('/sigh-in', req.url));
    }
  }

  if (isPublicRoutes) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isPrivateRoutes) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/filter/:path*', '/sigh-in', '/sigh-up'],
};
