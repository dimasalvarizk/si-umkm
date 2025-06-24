import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const dummyAdmin = {
  username: 'admin',
  password: '$2b$10$5SRM4Wc23K4gRdz6Nfw.AOINHo2VZzrgvTK8R5a8Wu/8XmdbZc5UK', // hash dari 'admin123'
  role: 'admin',
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Debug log
  console.log('Login attempt →', { username, password });
  console.log('Expected username:', dummyAdmin.username);
  console.log('Password match:', bcrypt.compareSync(password, dummyAdmin.password));

  if (
    username !== dummyAdmin.username ||
    !bcrypt.compareSync(password, dummyAdmin.password)
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = jwt.sign(
    { username, role: dummyAdmin.role },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' }
  );

  return res.status(200).json({ token });
}
