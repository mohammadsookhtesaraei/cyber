import { NextRequest } from 'next/server';

import { AuthenticatedUser } from '@/types/user-interface';

import { API_URL } from '@/configs/global';

export async function proxyAuth(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Cookie:
        `${request.cookies.get('accessToken')?.name}=${request.cookies.get('accessToken')?.value};${request.cookies.get('refreshToken')?.name}=${request.cookies.get('refreshToken')?.value}` ||
        '-',
    },
  });

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();
  return user || {};
}
