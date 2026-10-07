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

// دریافت اطلاعات کاربر با Access Token
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

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.user ?? null;
  } catch {
    return null;
  }
};

// دریافت Access Token و Refresh Token جدید
const refresh = async (refreshToken: string): Promise<Tokens | null> => {
  try {
    console.log('REFRESH START');

    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    console.log('REFRESH RESULT:', res.status);

    if (!res.ok) {
      return null;
    }

    const cookies = res.headers.getSetCookie();

    const pick = (name: string) =>
      cookies
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split(';')[0]
        .slice(name.length + 1);

    const accessToken = pick('accessToken');
    const newRefreshToken = pick('refreshToken');

    if (!accessToken || !newRefreshToken) {
      console.error('REFRESH COOKIES NOT FOUND');

      return null;
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('REFRESH ERROR:', error);

    return null;
  }
};

export async function proxyAuth(
  request: NextRequest
): Promise<ProxyAuthResult> {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 1. ابتدا Access Token را بررسی می‌کنیم
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

  // 2. Access Token نامعتبر است
  // بنابراین باید Refresh Token را بررسی کنیم
  if (!refreshToken) {
    return {
      user: null,
      tokens: null,
    };
  }

  // 3. دریافت Tokenهای جدید
  const tokens = await refresh(refreshToken);

  if (!tokens) {
    return {
      user: null,
      tokens: null,
    };
  }

  // 4. بررسی Access Token جدید
  const user = await getUser(tokens.accessToken);

  if (!user) {
    return {
      user: null,
      tokens: null,
    };
  }

  // 5. کاربر + Tokenهای جدید
  return {
    user,
    tokens,
  };
}
