// src/app/produk/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// ✅ Ubah definisi Props supaya TypeScript tidak bingung
type Params = { id: string };
type Props = { params: Params } | { params: Promise<Params> };

export default async function DetailProdukPage(props: Props) {
  // ✅ Deteksi apakah params adalah Promise dan resolve
  const params: Params =
    "then" in props.params ? await props.params : props.params;

  const produkId = parseInt(params.id, 10);

  if (isNaN(produkId)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-center px-4">
        ID produk tidak valid.
      </div>
    );
  }

  const produk = await prisma.produk.findUnique({
    where: { id: produkId },
  });

  if (!produk) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-center px-4">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-gray-50 p-8 rounded-2xl shadow border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{produk.nama}</h1>

        {produk.gambar ? (
          <Image
            src={`/uploads/${produk.gambar}`}
            alt={`Gambar produk ${produk.nama}`}
            width={800}
            height={400}
            priority
            className="rounded mb-6 object-cover w-full max-h-[400px]"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded mb-6 flex items-center justify-center text-gray-500">
            Tidak ada gambar
          </div>
        )}

        <p className="text-gray-700 mb-2">{produk.deskripsi}</p>
        <p className="text-green-700 font-semibold text-lg mb-1">
          Rp {produk.harga.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mb-6">Diposting oleh: {produk.email}</p>

        <div>
          <Link
            href={`/produk/${produk.id}/review`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Lihat & Tulis Ulasan
          </Link>
        </div>
      </div>
    </main>
  );
}
