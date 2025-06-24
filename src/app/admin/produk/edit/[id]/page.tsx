'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditProdukPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  const [produk, setProduk] = useState<any>(null);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProduk = async () => {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/produk/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok) {
        setProduk(result.produk);
        setNama(result.produk.nama);
        setDeskripsi(result.produk.deskripsi);
        setHarga(result.produk.harga.toString());
      } else {
        setError(result.error || 'Gagal memuat produk');
      }
    };

    fetchProduk();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', harga);
    if (gambar) formData.append('gambar', gambar);

    const res = await fetch(`/api/admin/produk/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      router.push('/admin/produk');
    } else {
      const result = await res.json();
      alert(result.error || 'Gagal mengedit produk.');
    }
  };

  if (error) {
    return <p className="text-red-600 text-center text-sm mt-6">{error}</p>;
  }

  if (!produk) return <p className="text-center text-sm mt-6">Memuat data produk...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-sm">
        <h1 className="text-lg font-semibold text-blue-700 text-center mb-4">Edit Produk UMKM</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1">Nama Produk</label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Deskripsi</label>
            <textarea
              className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Harga</label>
            <input
              type="number"
              className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              required
            />
          </div>

          {produk.gambar && (
            <div>
              <p className="text-gray-600 mb-1">Gambar Saat Ini:</p>
              <img
                src={`/uploads/${produk.gambar}`}
                alt="Gambar Produk"
                className="w-24 h-24 object-cover rounded border mb-2 mx-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Ganti Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGambar(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200 font-medium"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </main>
  );
}
