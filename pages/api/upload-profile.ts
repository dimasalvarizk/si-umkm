// pages/api/upload-profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Konfigurasi agar Next.js tidak mem-parse body secara otomatis
export const config = {
  api: {
    bodyParser: false,
  },
};

// API Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), '/public/uploads/profile');
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    filename: (_name, _ext, part) => `${Date.now()}-${part.originalFilename}`,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Error saat upload:', err);
      return res.status(500).json({ error: 'Gagal memproses unggahan' });
    }

    // Penanganan aman: cek apakah `files.foto` berupa array atau objek tunggal
    const foto = Array.isArray(files.foto) ? files.foto[0] : files.foto;

    if (!foto || !foto.newFilename) {
      return res.status(400).json({ error: 'Tidak ada file terupload' });
    }

    // Kirim path untuk disimpan di database atau digunakan di frontend
    const filePath = `/uploads/profile/${foto.newFilename}`;
    return res.status(200).json({ filePath });
  });
}
