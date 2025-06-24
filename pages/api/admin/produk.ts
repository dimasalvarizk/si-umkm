// pages/api/admin/produk.ts
import { verifyAdmin } from '../../../middleware/verifyAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // pastikan prisma sudah di-setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    verifyAdmin(req);

    // Ambil semua produk dari database
    const produk = await prisma.produk.findMany({
      orderBy: { id: 'desc' },
    });

    // Kembalikan ke frontend
    res.status(200).json({ produk });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
