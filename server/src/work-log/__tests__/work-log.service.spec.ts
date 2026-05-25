import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkLogService } from '../work-log.service';

const date = new Date('2025-05-20');
const createdAt = new Date('2025-05-20T10:00:00Z');
const updatedAt = new Date('2025-05-20T10:00:00Z');

const mockWorkType = { id: 'wt-1', name: 'Бетонирование' };

const mockWorkLog = {
  id: 'wl-1',
  date,
  workTypeId: 'wt-1',
  volume: 24,
  unit: 'м³',
  performerName: 'Иванов И.И.',
  createdAt,
  updatedAt,
  workType: mockWorkType,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- мок Prisma в тестах
const fn = (): any => jest.fn();

const mockPrisma = {
  workLog: {
    findMany: fn(),
    count: fn(),
    findUnique: fn(),
    create: fn(),
    update: fn(),
    delete: fn(),
  },
};

jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma),
}));

import { PrismaService } from '../../prisma/prisma.service';

describe('WorkLogService', () => {
  let service: WorkLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkLogService, PrismaService],
    }).compile();

    service = module.get<WorkLogService>(WorkLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('возвращает пагинированный список с hasMore = true', async () => {
      mockPrisma.workLog.findMany.mockResolvedValue([mockWorkLog]);
      mockPrisma.workLog.count.mockResolvedValue(25);

      const result = await service.findAll(1, 10, 'desc');

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(25);
      expect(result.hasMore).toBe(true);
      expect(mockPrisma.workLog.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { date: 'desc' },
        include: { workType: true },
      });
    });

    it('возвращает hasMore = false на последней странице', async () => {
      mockPrisma.workLog.findMany.mockResolvedValue([mockWorkLog]);
      mockPrisma.workLog.count.mockResolvedValue(10);

      const result = await service.findAll(1, 10, 'desc');

      expect(result.hasMore).toBe(false);
    });

    it('корректно считает skip для второй страницы', async () => {
      mockPrisma.workLog.findMany.mockResolvedValue([]);
      mockPrisma.workLog.count.mockResolvedValue(30);

      await service.findAll(2, 10, 'asc');

      expect(mockPrisma.workLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, orderBy: { date: 'asc' } }),
      );
    });

    it('возвращает пустой массив для пустой таблицы', async () => {
      mockPrisma.workLog.findMany.mockResolvedValue([]);
      mockPrisma.workLog.count.mockResolvedValue(0);

      const result = await service.findAll(1, 10, 'desc');

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('findOne', () => {
    it('возвращает запись по ID', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(mockWorkLog);

      const result = await service.findOne('wl-1');

      expect(result.id).toBe('wl-1');
      expect(result.workType?.name).toBe('Бетонирование');
    });

    it('выбрасывает NotFoundException для несуществующего ID', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('создаёт запись и возвращает DTO', async () => {
      mockPrisma.workLog.create.mockResolvedValue(mockWorkLog);

      const dto = {
        date: '2025-05-20',
        workTypeId: 'wt-1',
        volume: 24,
        unit: 'м³',
        performerName: 'Иванов И.И.',
      };

      const result = await service.create(dto);

      expect(result.id).toBe('wl-1');
      expect(mockPrisma.workLog.create).toHaveBeenCalledWith({
        data: {
          date: new Date('2025-05-20'),
          workTypeId: 'wt-1',
          volume: 24,
          unit: 'м³',
          performerName: 'Иванов И.И.',
        },
        include: { workType: true },
      });
    });
  });

  describe('update', () => {
    it('обновляет запись', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(mockWorkLog);
      const updated = { ...mockWorkLog, performerName: 'Петров П.П.' };
      mockPrisma.workLog.update.mockResolvedValue(updated);

      const result = await service.update('wl-1', {
        performerName: 'Петров П.П.',
      });

      expect(result.performerName).toBe('Петров П.П.');
      expect(mockPrisma.workLog.update).toHaveBeenCalledWith({
        where: { id: 'wl-1' },
        data: { performerName: 'Петров П.П.' },
        include: { workType: true },
      });
    });

    it('выбрасывает NotFoundException при обновлении несуществующей записи', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { performerName: 'Петров П.П.' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('удаляет запись', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(mockWorkLog);
      mockPrisma.workLog.delete.mockResolvedValue(undefined);

      await service.delete('wl-1');

      expect(mockPrisma.workLog.delete).toHaveBeenCalledWith({
        where: { id: 'wl-1' },
      });
    });

    it('выбрасывает NotFoundException при удалении несуществующей записи', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(null);

      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
