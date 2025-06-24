'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function ProfilPengguna() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newFotoFile, setNewFotoFile] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          nama: currentUser.displayName,
          email: currentUser.email,
          foto: currentUser.photoURL,
        });
        setNewNama(currentUser.displayName || '');
        setPreviewFoto(currentUser.photoURL || '');
      } else {
        setUser(null);
        router.push('/user/login'); // ⬅️ Redirect kalau belum login
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/user/login'); // ✅ Redirect setelah logout
    } catch (err) {
      console.error('Gagal logout:', err);
      alert('Gagal logout!');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB!');
        return;
      }
      setNewFotoFile(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    let uploadedUrl = user.foto;

    if (newFotoFile) {
      const formData = new FormData();
      formData.append('foto', newFotoFile);

      const res = await fetch('/api/upload-profile', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      uploadedUrl = result.filePath;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: newNama,
        photoURL: uploadedUrl,
      });

      alert('Profil diperbarui!');
      setIsEditing(false);
      setUser({
        nama: newNama,
        email: auth.currentUser.email,
        foto: uploadedUrl,
      });
    } catch (err) {
      console.error('Gagal update profil:', err);
      alert('Gagal update profil.');
    }
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Memuat data pengguna...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 text-gray-900">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Profil Pengguna</h1>

        <div className="flex flex-col items-center space-y-4 mb-6">
          <img
            src={previewFoto || '/default-avatar.png'}
            alt="Foto Profil"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />

          {!isEditing ? (
            <div className="text-center space-y-1">
              <p className="text-lg font-medium text-gray-800">👤 {user.nama}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <input
                type="text"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                placeholder="Nama baru"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              ✏️ Edit Profil
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                ✅ Simpan
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                ❌ Batal
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </main>
  );
}
