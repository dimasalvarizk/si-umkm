'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function UMKMLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectBasedOnRole = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      const role = docSnap.exists() ? docSnap.data().role || 'umkm' : 'umkm';
      router.push(role === 'pembeli' ? '/pembeli/dashboard' : '/user/dashboard');
    } catch (err: any) {
      console.error('Gagal membaca data role:', err.message);
      router.push('/user/dashboard');
    }
  };

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Cek apakah user sudah tersimpan di Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: 'umkm',
          createdAt: new Date().toISOString(),
        });
        console.log('User baru disimpan sebagai UMKM');
      }

      alert(`Selamat datang, ${user.displayName}`);
      await redirectBasedOnRole(user.uid);
    } catch (err: any) {
      alert('Login Google gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginEmail = async () => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      alert('Login berhasil: ' + result.user.email);
      await redirectBasedOnRole(result.user.uid);
    } catch (err: any) {
      alert('Login gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Login Pengguna</h1>

        <button
          onClick={handleLoginGoogle}
          className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition mb-4"
          disabled={loading}
        >
          {loading ? 'Sedang login...' : 'Login dengan Google'}
        </button>

        <div className="border-t border-gray-300 my-4" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          disabled={loading}
        />

        <button
          onClick={handleLoginEmail}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Sedang login...' : 'Login dengan Email'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{' '}
          <a href="/user/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
