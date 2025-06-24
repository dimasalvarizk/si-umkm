import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email tidak valid' });
  }

  try {
    const ulasan = await prisma.review.findMany({
      where: {
        produk: {
          email, // Produk milik UMKM ini
        },
      },
      include: {
        produk: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Tambahkan tipe eksplisit untuk 'u' agar TypeScript tidak error
    const formatted = ulasan.map((u: typeof ulasan[number]) => ({
      id: u.id,
      komentar: u.komentar,
      rating: u.rating,
      namaProduk: u.produk?.nama ?? '(Tidak diketahui)',
      reviewerEmail: u.email,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil ulasan', error });
  }
}
