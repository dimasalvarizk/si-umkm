'use client';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('admin_token', data.token);
      alert('Login admin berhasil');
      window.location.href = '/admin/dashboard';
    } else {
      alert(data.error || 'Login gagal');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-1 ring-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login Admin</h1>

        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white font-semibold py-3 w-full rounded hover:bg-blue-700 transition"
        >
        Login Sekarang
        </button>
      </div>
    </main>
  );
}
