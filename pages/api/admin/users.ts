import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminToken } from '@/lib/auth';
import { auth, firestore } from '@/lib/firebase-admin';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token || !verifyAdminToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const listUsersResult = await auth.listUsers();
    const users = await Promise.all(
      listUsersResult.users.map(async (user) => {
        const doc = await firestore.collection('users').doc(user.uid).get();
        const role = doc.exists ? doc.data()?.role : 'tidak diketahui';
        return {
          uid: user.uid,
          email: user.email,
          role,
        };
      })
    );

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
}
