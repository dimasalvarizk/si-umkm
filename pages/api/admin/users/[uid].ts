// pages/api/admin/users/[uid].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '../../../../middleware/verifyAdmin';
import { firestore } from '@/lib/firebase-admin';
import { auth } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = req.query.uid as string;

  await verifyAdmin(req, res); // JWT middleware

  if (req.method === 'PUT') {
    const { role } = req.body;
    try {
      await firestore.collection('users').doc(uid).update({ role });
      return res.status(200).json({ message: 'Role updated' });
    } catch (err) {
      console.error('Update role error:', err);
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Hapus dari Firebase Auth
      await auth.deleteUser(uid);
      // Hapus dari Firestore
      await firestore.collection('users').doc(uid).delete();
      return res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      console.error('Delete user error:', err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).end('Method Not Allowed');
}
