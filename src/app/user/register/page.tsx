'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('umkm');

  const handleRegister = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });

      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        name,
        role,
        createdAt: new Date(),
      });

      alert('Registrasi berhasil! Selamat datang, ' + name);

      window.location.href = role === 'pembeli' ? '/pembeli/dashboard' : '/user/dashboard';
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        alert('Email ini sudah terdaftar. Silakan login.');
      } else if (err.code === 'auth/invalid-email') {
        alert('Format email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        alert('Password harus minimal 6 karakter.');
      } else {
        alert('Gagal daftar: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Daftar Akun</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Jenis Pengguna
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="umkm">Pelaku UMKM</option>
              <option value="pembeli">Pembeli / Konsumen</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Daftar Sekarang
          </button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <a href="/user/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
