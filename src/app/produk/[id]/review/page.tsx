'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Review {
  id: number;
  komentar: string;
  rating: number;
  email: string;
  createdAt: string;
}

export default function ReviewProdukPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const produkId = id ? parseInt(id) : null;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [komentar, setKomentar] = useState('');
  const [rating, setRating] = useState(5);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!produkId) return;
    fetch(`/api/products/review?produkId=${produkId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [produkId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setEmail(user.email);
      else setEmail(null);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert('Harus login untuk memberi ulasan');
    if (!produkId) return alert('ID produk tidak valid');

    setLoading(true);
    try {
      const res = await fetch('/api/products/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ komentar, rating, email, produkId }),
      });

      if (!res.ok) throw new Error('Gagal kirim ulasan');

      const data = await res.json();
      alert('Ulasan berhasil dikirim');
      setKomentar('');
      setRating(5);
      setReviews((prev) => [data.review, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim ulasan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Ulasan Produk</h1>

        {email ? (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-gray-50 p-6 rounded-xl shadow border border-gray-200">
            <textarea
              placeholder="Tulis komentar Anda..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              className="w-full border px-4 py-2 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full border px-4 py-2 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} ⭐</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              {loading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-6 text-center">Login untuk memberikan ulasan.</p>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada ulasan.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border bg-white rounded-xl p-4 shadow-sm hover:shadow transition">
                <p className="font-semibold text-yellow-600">{'⭐'.repeat(r.rating)}</p>
                <p className="text-gray-800 mt-1">{r.komentar}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Oleh: {r.email} • {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
