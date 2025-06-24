import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { judul, deskripsi, tanggal, lokasi, kuota } = req.body;

    try {
      const pelatihan = await prisma.pelatihan.create({
        data: {
          judul,
          deskripsi,
          tanggal: new Date(tanggal),
          lokasi,
          kuota: parseInt(kuota),
        },
      });
      return res.status(201).json(pelatihan);
    } catch (err) {
      return res.status(500).json({ error: 'Gagal menambah pelatihan' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
