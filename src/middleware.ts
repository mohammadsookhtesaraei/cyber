import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { proxyAuth } from '@/utils/proxyAuth';

const cookieOptions = {
  httpOnly: true, // جاوااسکریپت نمی‌تواند کوکی را بخواند
  secure: process.env.NODE_ENV === 'production', // فقط روی اتصال امن ارسال می‌شود
  sameSite: 'lax' as const,
  path: '/',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const { user, tokens } = await proxyAuth(request);

  // آدرسی که کاربر باید به آن برود و اگر خالی بماند همان صفحه را می‌بیند
  let redirectTo = '';

  if (!user) {
    // کاربر وارد نشده فقط صفحه ورود را می‌تواند ببیند
    if (!path.startsWith('/auth')) redirectTo = '/auth';
  } else {
    // کاربر واردشده صفحه ورود را نباید ببیند
    if (path.startsWith('/auth')) redirectTo = '/profile';

    // فقط ادمین وارد پنل مدیریت می‌شود
    if (path.startsWith('/admin') && user.role !== 'ADMIN') redirectTo = '/';

    // کاربر فعال به صفحه تکمیل پروفایل نیازی ندارد
    if (path.startsWith('/check-profile') && user.isActive) {
      redirectTo = '/profile';
    }

    // کاربری که نام یا ایمیل ندارد باید پروفایلش را تکمیل کند
    if (path.startsWith('/profile') && (!user.name || !user.email)) {
      redirectTo = '/check-profile';
    }
  }

  // توکن جدید را روی درخواست می‌گذاریم تا صفحه‌ی سروری هم آن را ببیند
  if (tokens) {
    request.cookies.set('accessToken', tokens.accessToken);
    request.cookies.set('refreshToken', tokens.refreshToken);
  }

  // یا ریدایرکت می‌کنیم یا اجازه می‌دهیم صفحه باز شود
  const response = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url))
    : NextResponse.next({ request });

  // اگر توکن جدید گرفتیم، آن را در مرورگر ذخیره می‌کنیم
  if (tokens) {
    response.cookies.set('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // پانزده دقیقه
    });
    response.cookies.set('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // سی روز
    });
  }

  // اگر کاربر نبود، کوکی‌های خراب را پاک می‌کنیم
  if (!user) {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
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
