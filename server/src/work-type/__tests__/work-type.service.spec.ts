import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkTypeService } from '../work-type.service';

const mockWorkTypes = [
  { id: 'wt-1', name: 'Армирование' },
  { id: 'wt-2', name: 'Бетонирование' },
  { id: 'wt-3', name: 'Кладка перегородок' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- мок Prisma в тестах
const fn = (): any => jest.fn();

const mockPrisma = {
  workType: {
    findMany: fn(),
  },
};

jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma),
}));

import { PrismaService } from '../../prisma/prisma.service';

describe('WorkTypeService', () => {
  let service: WorkTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkTypeService, PrismaService],
    }).compile();

    service = module.get<WorkTypeService>(WorkTypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('возвращает все виды работ, отсортированные по названию', async () => {
      mockPrisma.workType.findMany.mockResolvedValue(mockWorkTypes);

      const result = await service.findAll();

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 'wt-1', name: 'Армирование' });
      expect(mockPrisma.workType.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });

    it('возвращает пустой массив, если справочник пуст', async () => {
      mockPrisma.workType.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
