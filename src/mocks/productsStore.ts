export type Product = { id: number; name: string; price: number; stock: number };

type Store = { products: Product[]; nextId: number };
type GlobalWithStore = typeof globalThis & { __mockProductsStore?: Store };

const g = globalThis as GlobalWithStore;

if (!g.__mockProductsStore) {
  g.__mockProductsStore = {
    products: [
      { id: 1, name: 'Café en grano', price: 120, stock: 15 },
      { id: 2, name: 'Té verde', price: 80, stock: 40 },
      { id: 3, name: 'Yerba mate', price: 95, stock: 25 },
      { id: 4, name: 'Azúcar rubia', price: 60, stock: 60 },
      { id: 5, name: 'Harina 0000', price: 70, stock: 35 },
      { id: 6, name: 'Aceite de oliva', price: 250, stock: 10 },
      { id: 7, name: 'Arroz largo', price: 50, stock: 100 },
      { id: 8, name: 'Fideos spaghetti', price: 45, stock: 90 },
      { id: 9, name: 'Lentejas', price: 85, stock: 30 },
      { id: 10, name: 'Garbanzos', price: 88, stock: 28 },
      { id: 11, name: 'Mermelada frutilla', price: 110, stock: 18 },
      { id: 12, name: 'Miel pura', price: 180, stock: 12 },
      { id: 13, name: 'Sal marina', price: 40, stock: 70 },
      { id: 14, name: 'Pimienta negra', price: 55, stock: 50 },
      { id: 15, name: 'Comino molido', price: 52, stock: 45 },
    ],
    nextId: 16,
  };
}

export const store = g.__mockProductsStore as Store;
