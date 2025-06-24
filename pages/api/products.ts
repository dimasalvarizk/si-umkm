import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // wajib untuk pakai formidable
  },
};

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Pastikan folder upload tersedia
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- GET: Ambil produk berdasarkan email ----------
  if (req.method === 'GET') {
    const { email } = req.query;
    try {
      const semuaProduk = await prisma.produk.findMany({
        where: email ? { email: String(email) } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(semuaProduk);
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
      return res.status(500).json({ message: 'Gagal mengambil data produk.' });
    }
  }

  if (req.method === 'POST') {
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ message: 'Gagal memproses data.' });
    }

    const { nama, deskripsi, harga, email } = fields;
    const gambarFile = files.gambar as formidable.File[] | formidable.File | undefined;

    if (!nama || !deskripsi || !harga || !email) {
      return res.status(400).json({ message: 'Data tidak lengkap.' });
    }

    let gambarNamaFile: string | null = null;
    if (gambarFile) {
      const fileObj = Array.isArray(gambarFile) ? gambarFile[0] : gambarFile;
      if (fileObj && fileObj.filepath) {
        gambarNamaFile = path.basename(fileObj.filepath);
      }
    }

    try {
      const produk = await prisma.produk.create({
        data: {
          nama: String(nama),
          deskripsi: String(deskripsi),
          harga: parseInt(String(harga)),
          gambar: gambarNamaFile,
          email: String(email),
        },
      });

      return res.status(201).json({ message: 'Produk berhasil ditambahkan', produk });
    } catch (error) {
      console.error('Gagal menyimpan produk:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan produk.' });
    }
  });

  return;
}


  // ---------- Method tidak diizinkan ----------
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
}
