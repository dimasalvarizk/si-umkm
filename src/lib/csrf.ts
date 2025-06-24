import csurf from 'csurf';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
});

export function csrfMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    req.cookies = parse(req.headers.cookie || '');

    return new Promise<void>((resolve, reject) => {
      csrfProtection(req as any, res as any, (err: any) => {
        if (err) {
          res.status(403).json({ message: 'CSRF token invalid', error: err.message });
          return reject(err);
        }
        resolve(handler(req, res));
      });
    });
  };
}
