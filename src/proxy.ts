import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// این یک تابع هست که ما ری کویست  پروکسی یا همون میدلور قدیم رو رو بهش پاس میدیم
// و یک درخواست میزنیم سمت بکند و بصورت دستی کوکی ها رو از این  ریکویست میدل ور میگیریم و توی هدر ریکویستمون دستی ست می کنیم
// تا بکند از طریق اکسس توکن و رفرش توکنش متوجه بشه که کیه کاربر ما با توجه به اطلاعات کاربر  روت هارو پروتکت می کنیم
import { proxyAuth } from '@/utils/proxyAuth';

export async function proxy(
  request: NextRequest
): Promise<NextResponse<unknown>> {
  // این میاد روت فعلی که درخواست میره سمتش رو میگیره
  const pathName = request.nextUrl.pathname;

  //  اگه رفت به روت پروفایل و کاربر لاگین نبود یا همون اکسس توکن نداشت بره به صفحه ورود یا ثبت نام
  if (pathName.startsWith('/profile')) {
    const user = await proxyAuth(request);
    if (!user) {
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
  }

  // اگر کاربر لاگین نیست نره به چگ پرو فایل
  if (pathName.startsWith('/check-profile')) {
    const user = await proxyAuth(request);
    if (!user) {
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
  }

  //  اینجا اگه کاربر پروفایلشو تکمیل کرده از قبل و ترو هست دیگه به روت چک پروفایل نتونه بره
  if (pathName.startsWith('/check-profile')) {
    const user = await proxyAuth(request);
    if (user?.isActive === true) {
      const profileUrl = new URL('/profile', request.url);
      return NextResponse.redirect(profileUrl);
    }
  }

  //  این میگه اگه کاربر ثبت نام کرده ولی پروفایلش رو تکمیل نکرده و فعال نیست نره به پروفایل کاربری
  if (pathName.startsWith('/profile')) {
    const user = await proxyAuth(request);
    if (!user?.name?.trim() || !user?.email?.trim()) {
      const checkProfile = new URL('/check-profile', request.url);
      return NextResponse.redirect(checkProfile);
    }
  }

  //  این اگه  کاربر لاگین هست کلا نره به صفحه ورود و ثبت نام
  if (pathName.startsWith('/auth')) {
    const user = await proxyAuth(request);
    if (user) {
      const profileUrl = new URL('/profile', request.url);
      return NextResponse.redirect(profileUrl);
    }
  }

  //  اگر کاربر ادمین نیست دسترسی هاش به روت های کاربر محدود بشه
  if (pathName.startsWith('/admin')) {
    const user = await proxyAuth(request);
    if (!user) {
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
    if (user && user?.role !== 'ADMIN') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  //  دراخرم در خواست ادامه پیدا کنه
  return NextResponse.next();
}

//  این ها روی این روت ها اعمال بشه
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/check-profile/:path*',
  ],
};
