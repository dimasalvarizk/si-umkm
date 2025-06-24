// pages/api/admin/pelatihan/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminToken } from '@/lib/auth'; // sesuaikan dengan logika verifikasi JWT kamu
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const pelatihan = await prisma.pelatihan.findUnique({
          where: { id: Number(id) },
        });
        if (!pelatihan) {
          return res.status(404).json({ error: 'Pelatihan tidak ditemukan' });
        }
        return res.status(200).json({ pelatihan });
      }

      case 'PUT': {
        const { judul, deskripsi, tanggal, lokasi, kuota } = req.body;
        const updated = await prisma.pelatihan.update({
          where: { id: Number(id) },
          data: {
            judul,
            deskripsi,
            tanggal: new Date(tanggal),
            lokasi,
            kuota: Number(kuota),
          },
        });
        return res.status(200).json({ pelatihan: updated });
      }

      case 'DELETE': {
        // Hapus semua pendaftaran yang terkait terlebih dahulu
        await prisma.pendaftaran.deleteMany({
          where: { pelatihanId: Number(id) },
        });

        // Setelah itu, hapus pelatihan
        await prisma.pelatihan.delete({
          where: { id: Number(id) },
        });

        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}
