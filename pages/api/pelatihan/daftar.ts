import type { NextApiRequest, NextApiResponse } from 'next';
import { csrfMiddleware } from '@/lib/csrf';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      console.log(`⛔ Method ${req.method} not allowed`);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const { pelatihanId, nama, email, alasan } = req.body;

    console.log('📥 Data diterima:', { pelatihanId, nama, email, alasan });

    if (!pelatihanId || !nama || !email || !alasan) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    await prisma.pendaftaran.create({
      data: {
        pelatihanId: parseInt(pelatihanId),
        nama,
        email,
        alasan,
      },
    });

    return res.status(200).json({ message: 'Pendaftaran berhasil!' });
  } catch (error) {
    console.error('❌ Error di API /pelatihan/daftar:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
}

export default csrfMiddleware(handler);
