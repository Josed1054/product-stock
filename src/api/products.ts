import api from './client';

export type Product = { id?: number; name: string; price: number; stock: number };

export const getProducts = () => api.get<Product[]>('/api/products');

export const createProduct = (p: Product) => api.post<Product>('/api/products', p);

export const updateStock = (id: number, stock: number) =>
  api.put<Product>(`/api/products/${id}/stock`, null, { params: { stock } });

