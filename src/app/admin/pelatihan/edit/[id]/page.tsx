'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPelatihanPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    lokasi: '',
    kuota: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('admin_token');
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/pelatihan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setForm({
            judul: data.pelatihan.judul,
            deskripsi: data.pelatihan.deskripsi,
            tanggal: data.pelatihan.tanggal.split('T')[0],
            lokasi: data.pelatihan.lokasi,
            kuota: data.pelatihan.kuota.toString(),
          });
        } else {
          setError(data.error || 'Gagal memuat data');
        }
      } catch {
        setError('Gagal mengambil data');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/pelatihan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          kuota: parseInt(form.kuota),
        }),
      });
      if (res.ok) {
        router.push('/admin/pelatihan');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan perubahan');
      }
    } catch {
      alert('Gagal mengirim data');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Edit Pelatihan</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Judul"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Lokasi"
            value={form.lokasi}
            onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            placeholder="Kuota"
            value={form.kuota}
            onChange={(e) => setForm({ ...form, kuota: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </main>
  );
}
