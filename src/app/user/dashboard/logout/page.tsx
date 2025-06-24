'use client';

import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth)
      .then(() => {
        router.push('/user/login'); // ✅ redirect ke login
      })
      .catch((err) => {
        console.error('Logout error:', err);
        router.push('/user/login');
      });
  }, [router]);

  return (
    <div className="text-center p-10 text-gray-600">Logging out...</div>
  );
}
