import { NextRequest } from 'next/server';

import { AuthenticatedUser } from '@/types/user-interface';

import { API_URL } from '@/configs/global';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface ProxyAuthResult {
  user: AuthenticatedUser | null;
  tokens: Tokens | null;
}

// اطلاعات کاربر را با Access Token می‌گیرد
const getUser = async (
  accessToken: string
): Promise<AuthenticatedUser | null> => {
  try {
    // درخواست اطلاعات کاربر
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    // اگر توکن معتبر نبود
    if (!res.ok) {
      return null;
    }

    // دریافت اطلاعات کاربر
    const data = await res.json();

    // برگرداندن کاربر
    return data.user ?? null;
  } catch {
    // خطای درخواست
    return null;
  }
};

// Access Token را با Refresh Token تمدید می‌کند
const refresh = async (refreshToken: string): Promise<Tokens | null> => {
  try {
    // ارسال Refresh Token به Backend
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    // اگر Refresh موفق نبود
    if (!res.ok) {
      return null;
    }

    // دریافت Cookieهای جدید
    const cookies = res.headers.getSetCookie();

    // استخراج مقدار یک Cookie
    const pick = (name: string) =>
      cookies
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split(';')[0]
        .slice(name.length + 1);

    // دریافت Access Token جدید
    const accessToken = pick('accessToken');

    // دریافت Refresh Token جدید
    const newRefreshToken = pick('refreshToken');

    // اگر یکی از توکن‌ها وجود نداشت
    if (!accessToken || !newRefreshToken) {
      return null;
    }

    // برگرداندن توکن‌های جدید
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    // خطای Refresh
    return null;
  }
};

// بررسی احراز هویت درخواست
export async function proxyAuth(
  request: NextRequest
): Promise<ProxyAuthResult> {
  // دریافت توکن‌ها از Cookie
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // بررسی Access Token
  const user = accessToken ? await getUser(accessToken) : null;

  // اگر Access Token معتبر بود
  if (user) {
    return {
      user,
      tokens: null,
    };
  }

  // اگر Refresh Token وجود نداشت
  if (!refreshToken) {
    return {
      user: null,
      tokens: null,
    };
  }

  // دریافت توکن‌های جدید
  const tokens = await refresh(refreshToken);

  // اگر Refresh ناموفق بود
  if (!tokens) {
    return {
      user: null,
      tokens: null,
    };
  }

  // بررسی Access Token جدید
  const newUser = await getUser(tokens.accessToken);

  // اگر توکن جدید معتبر بود
  if (newUser) {
    return {
      user: newUser,
      tokens,
    };
  }

  // اگر توکن جدید معتبر نبود
  return {
    user: null,
    tokens,
  };
}
