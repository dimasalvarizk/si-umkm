'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Produk {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
}

export default function ProdukUlasanPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProdukList(data);
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  const getImageUrl = (gambar: string | null): string => {
    if (!gambar) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }

    if (gambar.startsWith('http')) {
      return gambar;
    }

    return `/uploads/${gambar}`;
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Memuat daftar produk...</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-50 flex justify-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Pilih Produk untuk Diulas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {produkList.map((produk) => (
            <div
              key={produk.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition border border-gray-200"
            >
              <img
                src={getImageUrl(produk.gambar)}
                alt={produk.nama}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{produk.nama}</h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{produk.deskripsi}</p>

              <Link
                href={`/produk/${produk.id}/review`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ✍️ Beri Ulasan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
