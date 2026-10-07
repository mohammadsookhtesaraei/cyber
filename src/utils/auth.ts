import { createHash, randomUUID } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
  tokenType: 'access';
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
  tokenType: 'refresh';
}

export function generateAccessToken(userId: string, role: 'USER' | 'ADMIN') {
  return jwt.sign(
    { userId, role, tokenType: 'access' },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(userId: string, role: 'USER' | 'ADMIN') {
  return jwt.sign(
    { userId, role, tokenType: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '30d', jwtid: randomUUID() }
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload | false {
  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    if (payload.tokenType !== 'access') return false;
    return payload;
  } catch {
    return false;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | false {
  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshTokenPayload;

    if (payload.tokenType !== 'refresh') return false;
    return payload;
  } catch {
    return false;
  }
}

export function hashRefreshToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function hashOtp(otp: string) {
  return createHash('sha256').update(otp).digest('hex');
}
