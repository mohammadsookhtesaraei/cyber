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

// با اکسس توکن اطلاعات کاربر را می‌گیرد و اگر توکن نامعتبر بود، مقدار تهی برمی‌گرداند
const getUser = async (
  accessToken: string
): Promise<AuthenticatedUser | null> => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Cookie: `accessToken=${accessToken}` },
    cache: 'no-store', // نتیجه کش نشود
  });
  return res.ok ? ((await res.json()).user ?? null) : null;
};

// با رفرش توکن، توکن‌های جدید را از هدر Set-Cookie بک‌اند درمی‌آورد
const refresh = async (refreshToken: string): Promise<Tokens | null> => {
  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { Cookie: `refreshToken=${refreshToken}` },
    cache: 'no-store',
  });
  // بک‌اند رفرش را رد کرد
  if (!res.ok) return null;

  const cookies = res.headers.getSetCookie();
  // مقدار یک کوکی را از بین کوکی‌های بک‌اند پیدا می‌کند
  const pick = (name: string) =>
    cookies
      .find((c) => c.startsWith(`${name}=`))
      ?.split(';')[0]
      .slice(name.length + 1);

  const accessToken = pick('accessToken');
  const newRefreshToken = pick('refreshToken');
  return accessToken && newRefreshToken
    ? { accessToken, refreshToken: newRefreshToken }
    : null;
};

export async function proxyAuth(
  request: NextRequest
): Promise<ProxyAuthResult> {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // اگر اکسس توکن داریم، اول با همان اطلاعات کاربر را می‌گیریم
  const user = accessToken ? await getUser(accessToken) : null;

  // اکسس معتبر بود یا رفرش توکن نداریم، پس کار همین‌جا تمام می‌شود
  if (user || !refreshToken) return { user, tokens: null };

  // اکسس نبود یا منقضی بود، پس رفرش می‌زنیم و با توکن جدید دوباره کاربر را می‌گیریم
  const tokens = await refresh(refreshToken);
  const newUser = tokens ? await getUser(tokens.accessToken) : null;

  // فقط اگر همه‌چیز موفق بود توکن‌های جدید را برمی‌گردانیم
  return { user: newUser, tokens: newUser ? tokens : null };
}
