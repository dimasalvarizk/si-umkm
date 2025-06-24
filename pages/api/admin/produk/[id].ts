// pages/api/admin/produk/[id].ts
import { verifyAdmin } from '../../../../middleware/verifyAdmin';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// ✅ Matikan bodyParser default Next.js (wajib untuk formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Pastikan direktori upload tersedia
const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    await verifyAdmin(req, res);
    const produkId = Number(id);
    if (isNaN(produkId)) return res.status(400).json({ error: 'ID produk tidak valid' });

    // ✅ DELETE Produk
    if (req.method === 'DELETE') {
      await prisma.produk.delete({ where: { id: produkId } });
      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    }

    // ✅ GET Detail Produk
    if (req.method === 'GET') {
      const produk = await prisma.produk.findUnique({ where: { id: produkId } });
      return res.status(200).json({ produk });
    }

    // ✅ PUT Update Produk
    if (req.method === 'PUT') {
      const form = formidable({ uploadDir, keepExtensions: true });

      const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const { nama, deskripsi, harga } = fields;
      let gambar = fields.gambar;

      // ✅ Jika file baru di-upload
      if (files.gambar && Array.isArray(files.gambar)) {
        const file = files.gambar[0];
        const filename = path.basename(file.filepath);
        gambar = filename;
      }

      const produk = await prisma.produk.update({
        where: { id: produkId },
        data: {
          nama: nama?.toString(),
          deskripsi: deskripsi?.toString(),
          harga: parseInt(harga),
          gambar: gambar?.toString() || null,
        },
      });

      return res.status(200).json({ produk });
    }

    // ❌ Method tidak diizinkan
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error('[ADMIN PRODUK ERROR]', err);
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan server' });
  }
}
