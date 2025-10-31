"use client";
import { useEffect, useMemo, useState } from 'react';
import { createProduct, getProducts, updateStock, type Product } from '@/src/api/products';
import ProductForm, { type ProductFormValues } from './ProductForm';
import UpdateStockDialog from './UpdateStockDialog';
import Alert from '@/src/components/ui/Alert';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

type Message = { type: 'success' | 'error'; text: string } | null;

export default function ProductList() {
  const [message, setMessage] = useState<Message>(null);
  const [dialog, setDialog] = useState<{ id: number; stock: number } | null>(null);

  const qc = useQueryClient();

  const {
    data: items = [],
    isLoading,
    refetch,
    error,
  } = useQuery<Product[], AxiosError>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await getProducts();
      return data;
    },
  });

  useEffect(() => {
    if (!error) return;
    const status = error.response?.status;
    const text = status
      ? `Error ${status}: No se pudo listar productos`
      : 'Error de red al listar productos';
    setMessage({ type: 'error', text });
    // do not auto-clear here; global auto-dismiss effect handles timing
  }, [error]);

  const createMut = useMutation({
    mutationFn: async (data: ProductFormValues) => (await createProduct(data)).data,
    onSuccess: (prod) => {
      setMessage({ type: 'success', text: `Producto creado (id ${prod?.id ?? ''})` });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: AxiosError) => {
      const status = e.response?.status;
      setMessage({
        type: 'error',
        text: status ? `Error ${status}: No se pudo crear` : 'Error de red al crear',
      });
    },
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) =>
      (await updateStock(id, stock)).data,
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Stock actualizado' });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (e: AxiosError) => {
      const status = e.response?.status;
      setMessage({
        type: 'error',
        text: status ? `Error ${status}: No se pudo actualizar` : 'Error de red al actualizar',
      });
    },
  });

  const onCreate = (data: ProductFormValues) => createMut.mutate(data);
  const onUpdateStock = (id: number, stock: number) => updateMut.mutate({ id, stock });

  const rows = useMemo(() => items, [items]);

  // Auto-oculta el banner de acciones luego de unos segundos
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Productos</h1>
        <button
          className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900"
          onClick={() => refetch()}
        >
          Refrescar
        </button>
      </header>

      {message && (
        <Alert intent={message.type}>{message.text}</Alert>
      )}

      <section className="rounded border border-zinc-800 p-4">
        <h2 className="mb-2 font-medium">Crear producto</h2>
        <ProductForm onSubmit={onCreate} />
      </section>

      <section className="rounded border border-zinc-800 p-4">
        <h2 className="mb-3 font-medium">Listado</h2>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-zinc-100">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-zinc-800 p-2">ID</th>
                  <th className="border-b border-zinc-800 p-2">Nombre</th>
                  <th className="border-b border-zinc-800 p-2">Precio</th>
                  <th className="border-b border-zinc-800 p-2">Stock</th>
                  <th className="border-b border-zinc-800 p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id ?? `${p.name}-${p.price}`}>
                    <td className="border-b border-zinc-800 p-2">{p.id}</td>
                    <td className="border-b border-zinc-800 p-2">{p.name}</td>
                    <td className="border-b border-zinc-800 p-2">{p.price}</td>
                    <td className="border-b border-zinc-800 p-2">{p.stock}</td>
                    <td className="border-b border-zinc-800 p-2">
                      {typeof p.id === 'number' && (
                        <button
                          className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                          onClick={() => setDialog({ id: p.id!, stock: p.stock })}
                        >
                          Actualizar stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialog && (
        <UpdateStockDialog
          current={dialog.stock}
          onCancel={() => setDialog(null)}
          onConfirm={async (val) => {
            await onUpdateStock(dialog.id, val);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
