import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Pelatihan } from '@prisma/client';

export const revalidate = 60;

export default async function PelatihanListPage() {
  const pelatihan = await prisma.pelatihan.findMany({
    orderBy: { tanggal: 'asc' },
  });

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Pelatihan & Program UMKM</h1>

        {pelatihan.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada pelatihan tersedia saat ini.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pelatihan.map((item: Pelatihan) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.judul}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Tanggal: {new Date(item.tanggal).toLocaleDateString()} | Lokasi: {item.lokasi}
                </p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{item.deskripsi}</p>

                <Link
                  href={`/user/dashboard/pelatihan/${item.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Lihat Detail & Daftar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
