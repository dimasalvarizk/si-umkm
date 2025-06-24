'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function PembeliDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
      } else {
        router.push('/user/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLihatProduk = () => {
    router.push('/produk');
  };

  const handleUlasan = () => {
    router.push('/produk/ulasan');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/user/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-xl p-8 bg-white shadow-xl rounded-2xl ring-1 ring-gray-200 text-gray-900">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
          Dashboard Pembeli
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Selamat datang, <span className="font-semibold">{userEmail}</span>
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLihatProduk}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            🔍 Lihat & Cari Produk UMKM
          </button>

          <button
            onClick={handleUlasan}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            ⭐ Beri Ulasan Produk
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition mt-6"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </main>
  );
}
