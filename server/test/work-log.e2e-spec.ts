import {
  jest,
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

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
  $connect: fn().mockResolvedValue(undefined),
  $disconnect: fn().mockResolvedValue(undefined),
  workLog: {
    findMany: fn().mockResolvedValue([mockWorkLog]),
    count: fn().mockResolvedValue(1),
    findUnique: fn().mockResolvedValue(mockWorkLog),
    create: fn().mockResolvedValue(mockWorkLog),
    update: fn().mockResolvedValue(mockWorkLog),
    delete: fn().mockResolvedValue(undefined),
  },
  workType: {
    findMany: fn().mockResolvedValue([mockWorkType]),
  },
};

jest.mock('../src/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma),
}));

import { AppModule } from '../src/app.module';

describe('WorkLog API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /work-log', () => {
    it('возвращает список с пагинацией (200)', async () => {
      const response = await request(app.getHttpServer())
        .get('/work-log')
        .query({ page: 1, limit: 10, sortOrder: 'desc' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('hasMore');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('фильтрует по workTypeId', async () => {
      const response = await request(app.getHttpServer())
        .get('/work-log')
        .query({
          page: 1,
          limit: 10,
          sortOrder: 'desc',
          workTypeId: '550e8400-e29b-41d4-a716-446655440000',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('фильтрует по дате', async () => {
      const response = await request(app.getHttpServer())
        .get('/work-log')
        .query({
          page: 1,
          limit: 10,
          sortOrder: 'desc',
          date: '2025-05-20',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('hasMore');
    });

    it('комбинирует фильтры по дате и workTypeId', async () => {
      const response = await request(app.getHttpServer())
        .get('/work-log')
        .query({
          page: 1,
          limit: 10,
          sortOrder: 'desc',
          date: '2025-05-20',
          workTypeId: '550e8400-e29b-41d4-a716-446655440000',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('hasMore');
    });
  });

  describe('GET /work-log/:id', () => {
    it('возвращает запись по ID (200)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/work-log/550e8400-e29b-41d4-a716-446655440000',
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('wl-1');
    });

    it('возвращает 404 для несуществующего ID', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer()).get(
        '/work-log/550e8400-e29b-41d4-a716-446655440001',
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /work-log', () => {
    it('создаёт запись (201)', async () => {
      const dto = {
        date: '2025-05-20',
        workTypeId: '550e8400-e29b-41d4-a716-446655440000',
        volume: 24,
        unit: 'м³',
        performerName: 'Иванов И.И.',
      };

      const response = await request(app.getHttpServer())
        .post('/work-log')
        .send(dto);

      expect(response.status).toBe(201);
    });

    it('возвращает 400 при отсутствии обязательных полей', async () => {
      const response = await request(app.getHttpServer())
        .post('/work-log')
        .send({});

      expect(response.status).toBe(400);
    });

    it('возвращает 400 при невалидном unit', async () => {
      const dto = {
        date: '2025-05-20',
        workTypeId: '550e8400-e29b-41d4-a716-446655440000',
        volume: 10,
        unit: 'невалидная_единица',
        performerName: 'Иванов И.И.',
      };

      const response = await request(app.getHttpServer())
        .post('/work-log')
        .send(dto);

      expect(response.status).toBe(400);
    });

    it('возвращает 400 при отрицательном volume', async () => {
      const dto = {
        date: '2025-05-20',
        workTypeId: '550e8400-e29b-41d4-a716-446655440000',
        volume: -5,
        unit: 'м³',
        performerName: 'Иванов И.И.',
      };

      const response = await request(app.getHttpServer())
        .post('/work-log')
        .send(dto);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /work-log/:id', () => {
    it('обновляет запись (200)', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(mockWorkLog);
      mockPrisma.workLog.update.mockResolvedValue({
        ...mockWorkLog,
        performerName: 'Петров П.П.',
      });

      const response = await request(app.getHttpServer())
        .patch('/work-log/550e8400-e29b-41d4-a716-446655440000')
        .send({ performerName: 'Петров П.П.' });

      expect(response.status).toBe(200);
    });

    it('возвращает 404 при обновлении несуществующей записи', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .patch('/work-log/550e8400-e29b-41d4-a716-446655440001')
        .send({ performerName: 'Петров П.П.' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /work-log/:id', () => {
    it('удаляет запись (204)', async () => {
      mockPrisma.workLog.findUnique.mockResolvedValue(mockWorkLog);

      const response = await request(app.getHttpServer()).delete(
        '/work-log/550e8400-e29b-41d4-a716-446655440000',
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('GET /work-type', () => {
    it('возвращает справочник видов работ (200)', async () => {
      const response = await request(app.getHttpServer()).get('/work-type');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });
});
