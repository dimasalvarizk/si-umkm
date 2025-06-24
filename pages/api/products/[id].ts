import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { IncomingForm, File } from 'formidable';

const prisma = new PrismaClient();

// ⛔ Matikan bodyParser default
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return res.status(400).json({ message: 'ID tidak valid.' });
  }

  // ✅ GET produk by ID
  if (req.method === 'GET') {
    try {
      const produk = await prisma.produk.findUnique({ where: { id: idNum } });
      if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
      return res.status(200).json(produk);
    } catch (error) {
      console.error('Gagal ambil produk:', error);
      return res.status(500).json({ message: 'Gagal ambil data produk.' });
    }
  }

  // ✅ PUT (Update produk + gambar)
  if (req.method === 'PUT') {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({ message: 'Gagal memproses form.' });
      }

      const { nama, deskripsi, harga } = fields;

      if (!nama || !deskripsi || !harga) {
        return res.status(400).json({ message: 'Data tidak lengkap.' });
      }

      try {
        const produkLama = await prisma.produk.findUnique({ where: { id: idNum } });
        if (!produkLama) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

        let namaFileBaru = produkLama.gambar;

        if (files.gambar) {
          const file = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar;
          const ext = path.extname(file.originalFilename || '');
          const newName = `produk-${Date.now()}${ext}`;
          const newPath = path.join(process.cwd(), '/public/uploads', newName);

          // Rename & pindah file baru
          fs.renameSync(file.filepath, newPath);

          // Hapus gambar lama
          if (produkLama.gambar) {
            const lamaPath = path.join(process.cwd(), 'public/uploads', produkLama.gambar);
            if (fs.existsSync(lamaPath)) fs.unlinkSync(lamaPath);
          }

          namaFileBaru = newName;
        }

        const updated = await prisma.produk.update({
          where: { id: idNum },
          data: {
            nama: String(nama),
            deskripsi: String(deskripsi),
            harga: Number(harga),
            gambar: namaFileBaru,
          },
        });

        return res.status(200).json(updated);
      } catch (error) {
        console.error('Gagal update:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat update produk.' });
      }
    });

    return; // penting agar tidak lanjut ke bawah
  }

  // ✅ DELETE produk
  if (req.method === 'DELETE') {
    try {
      const produk = await prisma.produk.findUnique({ where: { id: idNum } });
      if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

      // Hapus gambar lama
      if (produk.gambar) {
        const filePath = path.join(process.cwd(), 'public/uploads', produk.gambar);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await prisma.produk.delete({ where: { id: idNum } });
      return res.status(200).json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
      console.error('Gagal hapus produk:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat hapus produk.' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
}
