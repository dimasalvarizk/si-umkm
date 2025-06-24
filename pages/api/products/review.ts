import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { komentar, rating, email, produkId } = req.body;

    if (!komentar || !rating || !email || !produkId) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    try {
      const review = await prisma.review.create({
        data: {
          komentar,
          rating: parseInt(rating),
          email,
          produkId: parseInt(produkId),
        },
      });

      return res.status(201).json({ message: 'Review berhasil ditambahkan', review });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    const { produkId } = req.query;

    if (!produkId) {
      return res.status(400).json({ message: 'produkId diperlukan' });
    }

    try {
      const reviews = await prisma.review.findMany({
        where: { produkId: parseInt(produkId as string) },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil review' });
    }
  }

  res.status(405).json({ message: 'Method tidak diizinkan' });
}
