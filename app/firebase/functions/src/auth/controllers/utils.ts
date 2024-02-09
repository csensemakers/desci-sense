import * as jwt from 'jsonwebtoken';

import { env } from '../../config/env';

export interface TokenData {
  userId: string;
}

export function generateAccessToken(data: TokenData, expiresIn: string) {
  return jwt.sign(data, env.TOKEN_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string): string {
  const verified = jwt.verify(token, env.TOKEN_SECRET, {
    complete: true,
  }) as unknown as jwt.JwtPayload & TokenData;
  return verified.payload.userId;
}
