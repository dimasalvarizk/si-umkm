import { prisma } from '@/lib/prisma';
import DaftarPelatihanForm from '../DaftarPelatihanForm';

export const dynamic = 'force-dynamic';

type PelatihanPageProps = {
  params: { id: string };
};

export default async function PelatihanDetailPage({ params }: PelatihanPageProps) {
  const { id } = params;
  const pelatihanId = Number(id);

  if (isNaN(pelatihanId)) {
    return <main>ID pelatihan tidak valid.</main>;
  }

  const pelatihan = await prisma.pelatihan.findUnique({
    where: { id: pelatihanId },
  });

  if (!pelatihan) {
    return <main>Pelatihan tidak ditemukan.</main>;
  }

  return (
    <main>
      <h1>{pelatihan.judul}</h1>
      <DaftarPelatihanForm pelatihanId={pelatihan.id} />
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
