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

const getUser = async (
  accessToken: string
): Promise<AuthenticatedUser | null> => {
  try {
    console.log('[AUTH] getUser → checking access token');

    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    console.log('[AUTH] getUser → status:', res.status);

    if (!res.ok) {
      console.log('[AUTH] getUser → access token invalid');

      return null;
    }

    const data = await res.json();

    console.log('[AUTH] getUser → success');

    return data.user ?? null;
  } catch (error) {
    console.error('[AUTH] getUser → error:', error);

    return null;
  }
};

const refresh = async (refreshToken: string): Promise<Tokens | null> => {
  try {
    console.log('[AUTH] refresh → starting refresh');

    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    console.log('[AUTH] refresh → status:', res.status);

    if (!res.ok) {
      console.log('[AUTH] refresh → refresh failed');

      return null;
    }

    const cookies = res.headers.getSetCookie();

    console.log('[AUTH] refresh → set-cookie count:', cookies.length);

    const pick = (name: string) =>
      cookies
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split(';')[0]
        .slice(name.length + 1);

    const accessToken = pick('accessToken');
    const newRefreshToken = pick('refreshToken');

    console.log('[AUTH] refresh → access token:', Boolean(accessToken));

    console.log('[AUTH] refresh → refresh token:', Boolean(newRefreshToken));

    if (!accessToken || !newRefreshToken) {
      console.log('[AUTH] refresh → tokens missing');

      return null;
    }

    console.log('[AUTH] refresh → success');

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('[AUTH] refresh → error:', error);

    return null;
  }
};

export async function proxyAuth(
  request: NextRequest
): Promise<ProxyAuthResult> {
  const accessToken = request.cookies.get('accessToken')?.value;

  const refreshToken = request.cookies.get('refreshToken')?.value;

  console.log('================ AUTH CHECK ================');

  console.log('[AUTH] path:', request.nextUrl.pathname);

  console.log('[AUTH] access token exists:', Boolean(accessToken));

  console.log('[AUTH] refresh token exists:', Boolean(refreshToken));

  // Access Token
  const user = accessToken ? await getUser(accessToken) : null;

  if (user) {
    console.log('[AUTH] RESULT → access token valid');

    console.log('=============================================');

    return {
      user,
      tokens: null,
    };
  }

  console.log('[AUTH] access token invalid or missing');

  // Refresh Token وجود ندارد
  if (!refreshToken) {
    console.log('[AUTH] RESULT → no refresh token');

    console.log('=============================================');

    return {
      user: null,
      tokens: null,
    };
  }

  // Refresh
  const tokens = await refresh(refreshToken);

  if (!tokens) {
    console.log('[AUTH] RESULT → refresh failed');

    console.log('=============================================');

    return {
      user: null,
      tokens: null,
    };
  }

  // Access Token جدید
  const newUser = await getUser(tokens.accessToken);

  if (newUser) {
    console.log('[AUTH] RESULT → refresh successful');

    console.log('=============================================');

    return {
      user: newUser,
      tokens,
    };
  }

  console.log('[AUTH] RESULT → new access token rejected');

  console.log('=============================================');

  return {
    user: null,
    tokens,
  };
}
