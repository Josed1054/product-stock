import { screen, waitFor } from '@testing-library/react';
import ProductList from './ProductList';
import { renderWithQuery, createTestQueryClient } from '@/test/test-utils';

// Mock axios.create used in src/api/client.ts
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  const create = jest.fn(() => mockAxiosInstance);
  return { __esModule: true, default: { create }, create };
});

describe('ProductList', () => {
  it('renders rows from GET /api/products', async () => {
    const axios = require('axios');
    const instance = (axios.create as jest.Mock).mock.results[0]?.value ?? axios.create();
    instance.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'Item A', price: 12.5, stock: 7 },
        { id: 2, name: 'Item B', price: 3.4, stock: 1 },
      ],
    });

    renderWithQuery(<ProductList />, { client: createTestQueryClient() });

    // Wait for one of the product names to appear
    await waitFor(() => expect(screen.getByText('Item A')).toBeInTheDocument());

    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeGreaterThan(2); // header + rows
  });
});
