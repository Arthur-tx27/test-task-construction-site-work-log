import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TableSkeleton } from '../ui/TableSkeleton';

describe('TableSkeleton', () => {
  it('отрисовывает 5 строк-скелетонов', () => {
    render(<TableSkeleton />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(6); // header + 5 rows
  });

  it('отрисовывает заголовки колонок', () => {
    render(<TableSkeleton />);
    expect(screen.getByText('Дата')).toBeTruthy();
    expect(screen.getByText('Вид работ')).toBeTruthy();
    expect(screen.getByText('Объём')).toBeTruthy();
    expect(screen.getByText('Исполнитель')).toBeTruthy();
  });
});
