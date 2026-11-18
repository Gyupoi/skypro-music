import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Search from './Search';

describe('Search', () => {
  it('отображает поле поиска с переданным значением', () => {
    render(<Search value="Elektro" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Поиск');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Elektro');
  });

  it('вызывает onChange при вводе текста', () => {
    const handleChange = vi.fn();

    render(<Search value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Поиск');

    fireEvent.change(input, {
      target: { value: 'Michael Jackson' },
    });

    expect(handleChange).toHaveBeenCalledWith('Michael Jackson');
  });
});
