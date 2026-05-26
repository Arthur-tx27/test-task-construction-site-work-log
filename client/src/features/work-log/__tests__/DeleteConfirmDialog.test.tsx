import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { DeleteConfirmDialog } from '../ui/DeleteConfirmDialog';

const target = {
  id: '1',
  date: '2025-05-20',
  workTypeId: 'wt-1',
  volume: 10,
  unit: 'м³',
  performerName: 'Иванов И.И.',
  createdAt: '2025-05-20T10:00:00Z',
  updatedAt: '2025-05-20T10:00:00Z',
  workType: { id: 'wt-1', name: 'Бетонирование' },
};

describe('DeleteConfirmDialog', () => {
  it('отрисовывает диалог с датой записи', () => {
    render(
      <DeleteConfirmDialog
        target={target}
        pending={false}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(screen.getByText('Удалить запись?')).toBeTruthy();
    expect(screen.getByText(/20\.05\.2025/)).toBeTruthy();
  });

  it('возвращает null при отсутствии target', () => {
    const { container } = render(
      <DeleteConfirmDialog
        target={null}
        pending={false}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('кнопка Удалить заблокирована при pending', () => {
    render(
      <DeleteConfirmDialog target={target} pending onCancel={jest.fn()} onConfirm={jest.fn()} />,
    );
    const btn = screen.getByText('Удалить');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});
