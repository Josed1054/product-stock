"use client";
import { useState } from 'react';

export default function UpdateStockDialog({
  current,
  onConfirm,
  onCancel,
}: {
  current: number;
  onConfirm: (stock: number) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [value, setValue] = useState<number>(current);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded border border-zinc-800 bg-zinc-900 p-4 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-zinc-100">Actualizar stock</h3>
        <label htmlFor="new-stock" className="mb-1 block text-sm text-zinc-300">Nuevo stock</label>
        <input
          id="new-stock"
          type="number"
          step={1}
          className="w-full rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 placeholder-zinc-400"
          placeholder="Ej. 10"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border border-zinc-700 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-white hover:bg-zinc-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
