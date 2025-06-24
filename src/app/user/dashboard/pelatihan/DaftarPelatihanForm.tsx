'use client';

import { useState, useEffect } from 'react';

export default function DaftarPelatihanForm({ pelatihanId }: { pelatihanId: number }) {
  const [csrfToken, setCsrfToken] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alasan, setAlasan] = useState('');

  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => {
        setCsrfToken(data.csrfToken);
        console.log('CSRF Token:', data.csrfToken);
      })
      .catch((err) => {
        console.error('Gagal ambil CSRF token:', err);
        setCsrfToken('');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { pelatihanId, nama, email, alasan };
    console.log('Mengirim data pendaftaran:', payload);

    const res = await fetch('/api/pelatihan/daftar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Pendaftaran berhasil!');
      setNama('');
      setEmail('');
      setAlasan('');
    } else {
      const err = await res.json();
      console.error('Gagal daftar:', err);
      alert(`Gagal daftar: ${err.error || 'Terjadi kesalahan'}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5 text-gray-800"
    >
      <h2 className="text-lg font-semibold text-center text-green-700 mb-2">Form Pendaftaran</h2>

      <input
        value={nama}
        onChange={e => setNama(e.target.value)}
        required
        placeholder="Nama Lengkap"
        className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="Email Aktif"
        className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <textarea
        value={alasan}
        onChange={e => setAlasan(e.target.value)}
        required
        placeholder="Alasan mengikuti pelatihan"
        className="border border-gray-300 px-4 py-2 w-full rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
      >
        Kirim Pendaftaran
      </button>
    </form>
  );
}
