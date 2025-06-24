import { prisma } from '@/lib/prisma';
import DaftarPelatihanForm from '../DaftarPelatihanForm';

export const dynamic = 'force-dynamic'; // Bisa pakai SSR bebas

export default async function PelatihanDetailPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const pelatihanId = Number(id);

  if (isNaN(pelatihanId)) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        ID pelatihan tidak valid.
      </main>
    );
  }

  const pelatihan = await prisma.pelatihan.findUnique({
    where: { id: pelatihanId },
  });

  if (!pelatihan) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Pelatihan tidak ditemukan.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-gray-50 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">{pelatihan.judul}</h1>
        <p className="text-sm text-gray-600 mb-2">
          Tanggal: {new Date(pelatihan.tanggal).toLocaleDateString()}
        </p>
        <p className="text-gray-800 mb-6">{pelatihan.deskripsi}</p>

        <DaftarPelatihanForm pelatihanId={pelatihan.id} />
      </div>
    </main>
  );
}
