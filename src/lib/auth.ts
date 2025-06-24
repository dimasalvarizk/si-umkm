// src/lib/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'admin_super_secret';

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
    if (!payload || payload.role !== 'admin') {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
