import { act, screen, waitFor } from '@testing-library/react';
import ProductList from './ProductList';
import { renderWithQuery, createTestQueryClient } from '@/test/test-utils';

jest.useFakeTimers();

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

describe('ProductList errors and banners', () => {
  it('shows error banner when GET fails and auto-cierra', async () => {
    const axios = require('axios');
    const instance = (axios.create as jest.Mock).mock.results[0]?.value ?? axios.create();
    instance.get.mockRejectedValueOnce({ response: { status: 500 } });

    renderWithQuery(<ProductList />, { client: createTestQueryClient() });

    await waitFor(() => expect(screen.getByText(/Error 500/i)).toBeInTheDocument());

    // Auto-dismissal after 4s
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    await waitFor(() => expect(screen.queryByText(/Error 500/i)).not.toBeInTheDocument());
  });
});

