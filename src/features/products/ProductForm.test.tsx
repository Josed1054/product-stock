import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm, { type ProductFormValues } from './ProductForm';

describe('ProductForm', () => {
  it('calls onSubmit with valid data', async () => {
    const onSubmit = jest.fn<Promise<void> | void, [ProductFormValues]>();
    render(<ProductForm onSubmit={onSubmit} />);

    const name = screen.getByLabelText(/nombre/i);
    const price = screen.getByLabelText(/precio/i);
    const stock = screen.getByLabelText(/stock/i);

    fireEvent.change(name, { target: { value: 'Test' } });
    fireEvent.change(price, { target: { value: '10.50' } });
    fireEvent.change(stock, { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const args = onSubmit.mock.calls[0][0];
    expect(args).toEqual({ name: 'Test', price: 10.5, stock: 3 });
  });
});
