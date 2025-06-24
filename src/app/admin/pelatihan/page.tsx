'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPelatihanPage() {
  const [pelatihanList, setPelatihanList] = useState<any[]>([]);
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    lokasi: '',
    kuota: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPelatihan = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/admin/pelatihan', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setPelatihanList(data.pelatihan || []);
        } else {
          setError(data.error || 'Gagal memuat data');
        }
      } catch (err) {
        setError('Terjadi kesalahan');
      }
    };

    fetchPelatihan();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/pelatihan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setPelatihanList([data.pelatihan, ...pelatihanList]);
        setForm({ judul: '', deskripsi: '', tanggal: '', lokasi: '', kuota: '' });
      } else {
        alert(data.error || 'Gagal menambah pelatihan');
      }
    } catch {
      alert('Terjadi kesalahan saat mengirim data');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    if (!confirm('Yakin ingin menghapus pelatihan ini?')) return;

    try {
      const res = await fetch(`/api/admin/pelatihan/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPelatihanList(pelatihanList.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/pelatihan/edit/${id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Manajemen Pelatihan</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
          <input
            type="text"
            placeholder="Judul"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Lokasi"
            value={form.lokasi}
            onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Kuota"
            value={form.kuota}
            onChange={(e) => setForm({ ...form, kuota: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Tambah Pelatihan
          </button>
        </form>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">Daftar Pelatihan</h2>
        {pelatihanList.length === 0 ? (
          <p className="text-gray-500">Belum ada pelatihan.</p>
        ) : (
          <table className="w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Lokasi</th>
                <th className="p-2 border">Kuota</th>
                <th className="p-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pelatihanList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.id}</td>
                  <td className="p-2 border">{item.judul}</td>
                  <td className="p-2 border">{new Date(item.tanggal).toLocaleDateString()}</td>
                  <td className="p-2 border">{item.lokasi}</td>
                  <td className="p-2 border">{item.kuota}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
