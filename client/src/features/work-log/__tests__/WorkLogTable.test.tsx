import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockWorkLog = {
  id: '1',
  date: '2025-05-20',
  workTypeId: 'wt-1',
  volume: 24,
  unit: 'м³',
  performerName: 'Иванов И.И.',
  createdAt: '2025-05-20T10:00:00Z',
  updatedAt: '2025-05-20T10:00:00Z',
  workType: { id: 'wt-1', name: 'Бетонирование' },
};

jest.mock('@/features/work-log/model/useWorkLogs');
jest.mock('@/features/work-log/model/useSentinelObserver');
jest.mock('@/features/work-log/model/useWorkLogMutations', () => ({
  useWorkLogDelete: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

import { WorkLogTable } from '@/features/work-log/ui/WorkLogTable';
import { useWorkLogs } from '@/features/work-log/model/useWorkLogs';

const mockedUseWorkLogs = useWorkLogs as jest.Mock;

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const defaultProps = {
  sortOrder: 'desc' as const,
  onEdit: jest.fn(),
  deleteTarget: null,
  onDeleteRequest: jest.fn(),
};

describe('WorkLogTable', () => {
  beforeEach(() => {
    mockedUseWorkLogs.mockReturnValue({
      data: {
        pages: [{ data: [mockWorkLog], total: 1, hasMore: false }],
        pageParams: [1],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });
  });

  it('отрисовывает скелетон в состоянии загрузки', () => {
    mockedUseWorkLogs.mockReturnValue({
      data: undefined,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
    });

    renderWithQuery(<WorkLogTable {...defaultProps} />);
    expect(screen.getByText('Дата')).toBeTruthy();
  });

  it('отрисовывает «Нет записей» при пустом списке', () => {
    mockedUseWorkLogs.mockReturnValue({
      data: {
        pages: [{ data: [], total: 0, hasMore: false }],
        pageParams: [1],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithQuery(<WorkLogTable {...defaultProps} />);
    expect(screen.getByText('Нет записей')).toBeTruthy();
  });

  it('отрисовывает строки с данными', () => {
    renderWithQuery(<WorkLogTable {...defaultProps} />);
    expect(screen.getByText('Бетонирование')).toBeTruthy();
    expect(screen.getByText('24 м³')).toBeTruthy();
    expect(screen.getByText('Иванов И.И.')).toBeTruthy();
  });
});
