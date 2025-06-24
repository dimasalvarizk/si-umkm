'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setAuthChecked(true);
      }
    });

    return () => unsub();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        <p className="text-lg">Cek autentikasi...</p>
      </div>
    );
  }

  return <div className="min-h-screen bg-white">{children}</div>;
}
