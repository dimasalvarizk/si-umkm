'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function DaftarProduk() {
  const [produk, setProduk] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
        fetchProduk(user.email);
      }
    });

    return () => unsub();
  }, []);

  const fetchProduk = async (email: string) => {
    try {
      const res = await fetch(`/api/products?email=${email}`);
      const data = await res.json();
      setProduk(data);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm('Yakin ingin menghapus produk ini?');
    if (!konfirmasi) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const text = await res.text();

      if (!res.ok) {
        console.error(`Gagal hapus produk (${res.status}):`, text);
        alert(`Gagal hapus produk: ${text}`);
        return;
      }

      await fetchProduk(userEmail);
    } catch (error) {
      console.error('Gagal menghapus:', error);
      alert('Terjadi kesalahan saat menghapus produk.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-gray-50 p-6 rounded-2xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Daftar Produk Saya</h1>
          <Link
            href="/user/dashboard/produk/tambah"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Tambah Produk
          </Link>
        </div>

        {produk.length === 0 ? (
          <p className="text-gray-600">Belum ada produk.</p>
        ) : (
          <ul className="space-y-6">
            {produk.map((p) => (
              <li
                key={p.id}
                className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow transition"
              >
                {p.gambar && (
                  <img
                    src={`/uploads/${p.gambar}`}
                    alt={p.nama}
                    className="w-full max-h-48 object-cover rounded mb-3"
                  />
                )}
                <p className="text-lg font-semibold text-gray-800">{p.nama}</p>
                <p className="text-sm text-gray-600 mb-1">{p.deskripsi}</p>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Harga: Rp {p.harga.toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/user/dashboard/produk/edit/${p.id}`)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm transition"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
