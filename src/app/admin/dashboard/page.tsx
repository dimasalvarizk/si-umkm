'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
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
        console.error('Gagal fetch data:', err);
        setError('Terjadi kesalahan saat mengambil data.');
      }
    };

    fetchProduk();
  }, [router]);

  if (error) {
    return <div className="p-10 text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard Admin</h1>

        {/* Tombol Navigasi */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => router.push('/admin/produk')}
          >
            Manajemen Produk
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => router.push('/admin/pelatihan')}
          >
            Manajemen Pelatihan
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            onClick={() => router.push('/admin/users')}
          >
            Manajemen Pengguna
          </button>
          <button
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={() => {
              localStorage.removeItem('admin_token');
              router.push('/admin/login');
            }}
          >
            Logout
          </button>
        </div>

        {/* Tabel Produk */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Daftar Produk UMKM</h2>
        {produkList.length === 0 ? (
          <p className="text-gray-500">Belum ada produk.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Deskripsi</th>
                  <th className="p-2 border">Harga</th>
                  <th className="p-2 border">Gambar</th>
                </tr>
              </thead>
              <tbody>
                {produkList.map((produk) => (
                  <tr key={produk.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{produk.id}</td>
                    <td className="p-2 border">{produk.nama}</td>
                    <td className="p-2 border">{produk.deskripsi}</td>
                    <td className="p-2 border">Rp {produk.harga}</td>
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
