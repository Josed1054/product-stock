import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProductForm from './ProductForm';

describe('ProductForm validation', () => {
  it('shows validation errors and blocks submit when invalid', async () => {
    const onSubmit = jest.fn();
    render(<ProductForm onSubmit={onSubmit} />);

    // Submit without filling values
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    // Name required and price must be > 0 (default price is 0)
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Price must be greater than 0/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('resets the form after successful submit', async () => {
    const onSubmit = jest.fn();
    render(<ProductForm onSubmit={onSubmit} />);

    const name = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    const price = screen.getByLabelText(/precio/i) as HTMLInputElement;
    const stock = screen.getByLabelText(/stock/i) as HTMLInputElement;

    fireEvent.change(name, { target: { value: 'Producto Test' } });
    fireEvent.change(price, { target: { value: '10' } });
    fireEvent.change(stock, { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());

    // After reset: name empty, price 0, stock 0
    expect(name.value).toBe('');
    expect(price.value).toBe('0');
    expect(stock.value).toBe('0');
  });
});

