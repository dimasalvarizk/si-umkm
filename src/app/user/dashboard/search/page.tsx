'use client';

import { gql, useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import client from '@/lib/apollo-client';
import Link from 'next/link';

const SEARCH = gql`
  query Search($keyword: String!) {
    searchProduk(keyword: $keyword) {
      id
      nama
      deskripsi
      gambar
    }
    searchPelatihan(keyword: $keyword) {
      id
      judul
      deskripsi
    }
  }
`;

export default function Pencarian() {
  const [keyword, setKeyword] = useState('');
  const [search, { data }] = useLazyQuery(SEARCH, { client });

  const handleSearch = () => {
    if (keyword.trim() !== '') search({ variables: { keyword } });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Pencarian Produk & Pelatihan
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Masukkan kata kunci..."
            className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </div>

        {data && (
          <>
            {/* Produk Section */}
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Produk</h2>
            {data.searchProduk.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Tidak ada produk ditemukan.</p>
            ) : (
              data.searchProduk.map((p: any) => (
                <div key={p.id} className="p-4 border rounded-xl mb-4 bg-gray-50 flex gap-4 shadow-sm hover:shadow">
                  {p.gambar && (
                    <img
                      src={`/uploads/${p.gambar}`}
                      alt={p.nama}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <Link href={`/produk/${p.id}`}>
                      <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                        {p.nama}
                      </span>
                    </Link>
                    <p className="text-sm text-gray-700">{p.deskripsi}</p>
                  </div>
                </div>
              ))
            )}

            {/* Pelatihan Section */}
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Pelatihan</h2>
            {data.searchPelatihan.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Tidak ada pelatihan ditemukan.</p>
            ) : (
              data.searchPelatihan.map((p: any) => (
                <div key={p.id} className="p-4 border rounded-xl mb-4 bg-white shadow-sm hover:shadow transition">
                  <Link href={`/user/dashboard/pelatihan/${p.id}`}>
                    <span className="text-green-600 font-semibold hover:underline cursor-pointer">
                      {p.judul}
                    </span>
                  </Link>
                  <p className="text-sm text-gray-700 mt-1">{p.deskripsi}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </main>
  );
}
