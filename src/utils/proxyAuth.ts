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
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    // فقط Access Token نامعتبر است که باید Refresh شود
    if (res.status === 401) {
      return null;
    }

    // خطای سرور را هم کاربر نامعتبر در نظر می‌گیریم
    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.user ?? null;
  } catch {
    return null;
  }
};

// Access Token را با Refresh Token تمدید می‌کند
const refresh = async (refreshToken: string): Promise<Tokens | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    // Cookieهای جدید Backend
    const cookies = res.headers.getSetCookie();

    const pick = (name: string) =>
      cookies
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split(';')[0]
        .slice(name.length + 1);

    const accessToken = pick('accessToken');
    const newRefreshToken = pick('refreshToken');

    if (!accessToken || !newRefreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    return null;
  }
};

// بررسی احراز هویت درخواست
export async function proxyAuth(
  request: NextRequest
): Promise<ProxyAuthResult> {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // ابتدا Access Token را بررسی می‌کنیم
  if (accessToken) {
    const user = await getUser(accessToken);

    // Access Token معتبر است
    if (user) {
      return {
        user,
        tokens: null,
      };
    }
  }

  // Access Token معتبر نیست؛ باید Refresh کنیم
  if (!refreshToken) {
    return {
      user: null,
      tokens: null,
    };
  }

  // دریافت Access و Refresh جدید
  const tokens = await refresh(refreshToken);

  // Refresh ناموفق بود
  if (!tokens) {
    return {
      user: null,
      tokens: null,
    };
  }

  // بررسی Access Token جدید
  const user = await getUser(tokens.accessToken);

  // Access Token جدید معتبر است
  if (!user) {
    return {
      user: null,
      tokens: null,
    };
  }

  // کاربر و Cookieهای جدید را به Proxy اصلی برمی‌گردانیم
  return {
    user,
    tokens,
  };
}
