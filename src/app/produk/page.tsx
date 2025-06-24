import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

const prisma = new PrismaClient();

export const revalidate = 30; // Regenerasi statis setiap 30 detik

export default async function KatalogProdukPage() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Katalog Produk UMKM
        </h1>

        {produk.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada produk ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produk.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow hover:shadow-md transition"
              >
                {item.gambar && typeof item.gambar === 'string' && item.gambar.trim() !== '' ? (
                  <Image
                    src={`/uploads/${item.gambar}`}
                    alt={item.nama}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48 rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded mb-3">
                    Tidak ada gambar
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-800">{item.nama}</h2>
                <p className="text-sm text-gray-600 mb-1">{item.deskripsi}</p>
                <p className="font-bold text-green-700 mb-1">
                  Rp {item.harga.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mb-3">Oleh: {item.email}</p>

                <Link
                  href={`/produk/${item.id}`}
                  className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 text-sm transition"
                >
                  Lihat Detail & Ulasan
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
