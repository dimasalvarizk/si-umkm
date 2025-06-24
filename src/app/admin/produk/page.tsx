// src/app/admin/produk/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminManajemenProdukPage() {
  const [produkList, setProdukList] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduk = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/admin/produk', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok) {
          setProdukList(result.produk || []);
        } else {
          setError(result.error || 'Unauthorized');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Terjadi kesalahan saat mengambil data.');
      }
    };

    fetchProduk();
  }, [router]);

  const handleHapus = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const res = await fetch(`/api/admin/produk/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProdukList(produkList.filter((p) => p.id !== id));
      } else {
        alert('Gagal menghapus produk.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6"> Manajemen Produk</h1>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : produkList.length === 0 ? (
          <p className="text-gray-500">Belum ada produk.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Harga</th>
                  <th className="p-2 border">Deskripsi</th>
                  <th className="p-2 border">Gambar</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkList.map((produk) => (
                  <tr key={produk.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{produk.id}</td>
                    <td className="p-2 border">{produk.nama}</td>
                    <td className="p-2 border">Rp {produk.harga}</td>
                    <td className="p-2 border">{produk.deskripsi}</td>
                    <td className="p-2 border">
                      {produk.gambar ? (
                        <img
                          src={`/uploads/${produk.gambar}`}
                          alt={produk.nama}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => (e.currentTarget.src = '/uploads/default.png')}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => router.push(`/admin/produk/edit/${produk.id}`)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleHapus(produk.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
