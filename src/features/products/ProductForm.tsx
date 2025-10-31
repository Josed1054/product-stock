"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be >= 0"),
});

export type ProductFormValues = z.infer<typeof Schema>;

export default function ProductForm({
  onSubmit,
  disabled,
}: Readonly<{
  onSubmit: (d: ProductFormValues) => void | Promise<void>;
  disabled?: boolean;
}>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", price: 0, stock: 0 },
  });

  const submit = async (data: ProductFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-2"
      autoComplete="off"
      noValidate
    >
      <label htmlFor="name" className="text-sm text-zinc-300">
        Nombre
      </label>
      <input
        id="name"
        placeholder="Ej. Producto A"
        className="rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 placeholder-zinc-400"
        autoComplete="off"
        {...register("name")}
      />
      {errors.name && (
        <span className="text-sm text-red-600">{errors.name.message}</span>
      )}
      <label htmlFor="price" className="text-sm text-zinc-300">
        Precio
      </label>
      <input
        id="price"
        placeholder="Ej. 100"
        type="number"
        step={1}
        className="rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 placeholder-zinc-400"
        autoComplete="off"
        {...register("price", { valueAsNumber: true })}
      />
      {errors.price && (
        <span className="text-sm text-red-600">{errors.price.message}</span>
      )}
      <label htmlFor="stock" className="text-sm text-zinc-300">
        Stock
      </label>
      <input
        id="stock"
        placeholder="Ej. 50"
        type="number"
        step={1}
        className="rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 placeholder-zinc-400"
        autoComplete="off"
        {...register("stock", { valueAsNumber: true })}
      />
      {errors.stock && (
        <span className="text-sm text-red-600">{errors.stock.message}</span>
      )}
      <button
        type="submit"
        className="mt-2 rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60"
        disabled={disabled || isSubmitting}
      >
        Guardar
      </button>
    </form>
  );
}
