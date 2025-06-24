'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/user/login');
      } else {
        setUserEmail(user.email);
        setUserPhoto(user.photoURL);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-4xl bg-gray-50 p-8 rounded-2xl shadow border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard UMKM</h1>

        {userPhoto && (
          <img
            src={userPhoto}
            alt="Foto Profil"
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-blue-400 shadow"
          />
        )}

        <p className="text-lg font-semibold text-gray-800">{userEmail}</p>
        <p className="mb-6 text-sm text-gray-600">Selamat datang kembali!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <DashboardLink href="/user/dashboard/produk" label="🛒 Tambah Produk" />
          <DashboardLink href="/produk" label="📢 Lihat Katalog Produk" />
          <DashboardLink href="/user/dashboard/ulasan" label="⭐ Ulasan Produk Saya" />
          <DashboardLink href="/user/dashboard/pelatihan" label="🎓 Pelatihan & Program" />
          <DashboardLink href="/user/dashboard/search" label="🔍 Cari Produk/Program" />
          <DashboardLink href="/user/dashboard/profil" label="👤 Profil Saya" />
          <DashboardLink href="/user/dashboard/logout" label="🚪 Logout" />
          <DashboardLink href="/" label="🏠 Kembali ke Beranda" />
        </div>
      </div>
    </div>
  );
}

function DashboardLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="p-4 border border-gray-300 rounded-xl bg-white hover:bg-blue-50 transition cursor-pointer text-gray-800 shadow-sm hover:shadow-md">
        <span className="text-lg font-medium">{label}</span>
      </div>
    </Link>
  );
}
