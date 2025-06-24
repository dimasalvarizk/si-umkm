'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Si-UMKM</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Platform digital untuk membantu pelaku UMKM mempublikasikan produk, mendapatkan ulasan, dan mengikuti program pelatihan dari pemerintah kota.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/user/register"
            className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/produk"
            className="bg-blue-800 text-white px-6 py-3 rounded font-semibold hover:bg-blue-900"
          >
            Lihat Katalog Produk
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
        <FeatureCard
          icon="🛒"
          title="Publikasi Produk"
          desc="Unggah produk UMKM Anda dan jangkau lebih banyak pembeli."
        />
        <FeatureCard
          icon="⭐"
          title="Ulasan Pembeli"
          desc="Terima ulasan langsung dari konsumen untuk meningkatkan kualitas."
        />
        <FeatureCard
          icon="🎓"
          title="Pelatihan UMKM"
          desc="Ikuti pelatihan dan program pembinaan dari pemerintah secara gratis."
        />
      </section>

      {/* CTA Akhir */}
      <section className="text-center py-12 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Gabung dan Kembangkan UMKM Anda Sekarang!</h2>
        <Link
          href="/user/register"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Mulai Sekarang
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center p-6 border rounded shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
