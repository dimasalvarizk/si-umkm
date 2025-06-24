'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Ulasan {
  id: number;
  isi: string;
  rating: number;
  namaProduk: string;
  reviewerEmail: string;
}

export default function UlasanSayaPage() {
  const [ulasan, setUlasan] = useState<Ulasan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        setUserEmail(user.email);
        await fetchUlasan(user.email);
      }
    });

    return () => unsub();
  }, []);

  const fetchUlasan = async (email: string) => {
    try {
      const res = await fetch(`/api/ulasan?email=${email}`);
      const data = await res.json();
      setUlasan(data);
    } catch (err) {
      console.error('Gagal mengambil ulasan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Ulasan Produk Saya</h1>

        {loading ? (
          <p className="text-center text-gray-600">Memuat ulasan...</p>
        ) : ulasan.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada ulasan untuk produk Anda.</p>
        ) : (
          <ul className="space-y-4">
            {ulasan.map((u) => (
              <li key={u.id} className="border bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <p className="font-semibold text-gray-800">
                  <span className="text-blue-600">{u.reviewerEmail}</span> memberi rating{' '}
                  <span className="text-yellow-600">{u.rating}⭐</span> pada{' '}
                  <span className="italic text-gray-700">{u.namaProduk}</span>
                </p>
                <p className="text-sm text-gray-700 mt-2">{u.isi}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
