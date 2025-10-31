"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductList from '@/src/features/products/ProductList';
import { useAuthStore } from '@/src/auth/authStore';

export default function ProductsPage() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div />
        <button
          onClick={() => {
            clear();
            router.replace('/login');
          }}
          className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900"
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </div>
      <ProductList />
    </main>
  );
}
