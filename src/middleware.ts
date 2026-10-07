import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { proxyAuth } from '@/utils/proxyAuth';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const { user, tokens } = await proxyAuth(request);

  let redirectTo = '';

  if (!user) {
    if (!path.startsWith('/auth')) {
      redirectTo = '/auth';
    }
  } else {
    if (path.startsWith('/auth')) {
      redirectTo = '/profile';
    }

    if (path.startsWith('/admin') && user.role !== 'ADMIN') {
      redirectTo = '/';
    }

    if (path.startsWith('/check-profile') && user.isActive) {
      redirectTo = '/profile';
    }

    if (path.startsWith('/profile') && (!user.name || !user.email)) {
      redirectTo = '/check-profile';
    }
  }

  /*
   * اگر Refresh انجام شده باشد،
   * Cookie جدید را روی Request قرار می‌دهیم
   * تا ادامه Request همین Token جدید را ببیند.
   */
  if (tokens) {
    request.cookies.set('accessToken', tokens.accessToken);
    request.cookies.set('refreshToken', tokens.refreshToken);
  }

  /*
   * Response نهایی
   */
  const response = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url))
    : NextResponse.next({
        request,
      });

  /*
   * Cookie جدید را در Browser ذخیره می‌کنیم.
   */
  if (tokens) {
    response.cookies.set('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/check-profile/:path*',
  ],
};
