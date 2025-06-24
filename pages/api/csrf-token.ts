import type { NextApiRequest, NextApiResponse } from 'next';
import csurf from 'csurf';
import { serialize } from 'cookie';

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  csrfProtection(req as any, res as any, () => {
    const token = (req as any).csrfToken();
    res.setHeader(
      'Set-Cookie',
      serialize('XSRF-TOKEN', token, {
        httpOnly: false, // client-side bisa baca
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    );
    res.status(200).json({ csrfToken: token });
  });
}
