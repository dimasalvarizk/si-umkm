import { verifyAdmin } from '../../../middleware/verifyAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
     verifyAdmin(req, res);

    if (req.method === 'GET') {
      const pelatihan = await prisma.pelatihan.findMany({
        orderBy: { tanggal: 'desc' },
      });
      return res.status(200).json({ pelatihan });
    }

    if (req.method === 'POST') {
      const { judul, deskripsi, tanggal, lokasi, kuota } = req.body;

      if (!judul || !deskripsi || !tanggal || !lokasi || !kuota) {
        return res.status(400).json({ error: 'Semua field wajib diisi.' });
      }

      const pelatihanBaru = await prisma.pelatihan.create({
        data: {
          judul,
          deskripsi,
          tanggal: new Date(tanggal),
          lokasi,
          kuota: parseInt(kuota),
        },
      });

      return res.status(201).json({ pelatihan: pelatihanBaru });
    }

    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
}
