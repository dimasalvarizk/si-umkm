'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminManajemenPenggunaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else {
        setError(data.error || 'Unauthorized');
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat data pengguna.');
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
        );
      } else {
        alert('Gagal mengubah role pengguna.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (uid: string) => {
    const token = localStorage.getItem('admin_token');
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.uid !== uid));
      } else {
        alert('Gagal menghapus pengguna.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] px-8 py-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-[#1e40af] mb-8">Manajemen Pengguna</h1>

        {error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm text-gray-700">
              <thead className="bg-[#e0e7ff]">
                <tr>
                  <th className="p-3 border font-semibold text-left">Email</th>
                  <th className="p-3 border font-semibold text-left">Role</th>
                  <th className="p-3 border font-semibold text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-[#c7d2fe] transition-colors duration-200">
                    <td className="p-3 border truncate max-w-xs">{user.email}</td>
                    <td className="p-3 border">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="umkm">UMKM</option>
                        <option value="pembeli">Pembeli</option>
                      </select>
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleDelete(user.uid)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
