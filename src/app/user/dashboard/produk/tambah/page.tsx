'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function TambahProdukPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    gambar: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/user/login');
      else setUserEmail(user.email);
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('deskripsi', form.deskripsi);
      formData.append('harga', form.harga);
      formData.append('email', userEmail);
      if (form.gambar) formData.append('gambar', form.gambar);

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal simpan');

      alert('Produk berhasil ditambahkan');
      router.push('/user/dashboard/produk');
    } catch (err: any) {
      console.error('Error:', err);
      alert(`Terjadi kesalahan: ${err.message || 'Tidak diketahui'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-xl bg-gray-50 p-6 rounded-2xl shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Tambah Produk</h1>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Nama Produk"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            required
          />
          <input
            type="number"
            placeholder="Harga"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm({ ...form, gambar: file });
            }}
            className="w-full text-sm text-gray-700"
          />
          <button
            type="submit"
            disabled={loading || !userEmail}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Menyimpan...' : 'Tambah Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
