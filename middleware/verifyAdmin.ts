// lib/middleware/verifyAdmin.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

export function verifyAdmin(req: NextApiRequest, res: unknown) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new Error('No token');

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

  // pastikan decoded adalah JwtPayload
  if (typeof decoded === 'string' || !(decoded as JwtPayload).role) {
    throw new Error('Invalid token payload');
  }

  const payload = decoded as JwtPayload;

  if (payload.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return payload;
}
