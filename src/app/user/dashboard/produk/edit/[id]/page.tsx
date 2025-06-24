'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditProdukPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    gambar: '',
  });
  const [fileBaru, setFileBaru] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Produk tidak ditemukan');
        const data = await res.json();
        setForm({
          nama: data.nama,
          deskripsi: data.deskripsi,
          harga: data.harga.toString(),
          gambar: data.gambar || '',
        });
      } catch (err) {
        alert('Gagal mengambil data produk');
        router.push('/user/dashboard/produk');
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('deskripsi', form.deskripsi);
      formData.append('harga', form.harga);
      if (fileBaru) {
        formData.append('gambar', fileBaru);
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal update');

      alert('Produk berhasil diperbarui');
      router.push('/user/dashboard/produk');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengupdate produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-xl bg-gray-50 p-6 rounded-2xl shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Edit Produk</h1>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            placeholder="Nama Produk"
            required
          />
          <textarea
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            placeholder="Deskripsi Produk"
            required
          />
          <input
            type="number"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            placeholder="Harga"
            required
          />

          {form.gambar && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Gambar Lama:</p>
              <img
                src={`/uploads/${form.gambar}`}
                alt="Gambar produk"
                className="w-32 h-auto rounded mb-3 border"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFileBaru(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
