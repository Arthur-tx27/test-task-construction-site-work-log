import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { mapWorkLogToResponse } from './work-log.mapper';
import type {
  PaginatedWorkLogResponse,
  WorkLogResponse,
} from '../types/work-log.types';
import type { SortOrder } from '../../generated/prisma/internal/prismaNamespace';
import type { WorkLogUncheckedUpdateInput } from '../../generated/prisma/models/WorkLog';

@Injectable()
export class WorkLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить список записей с пагинацией и сортировкой.
   */
  async findAll(
    page: number,
    limit: number,
    sortOrder: SortOrder,
  ): Promise<PaginatedWorkLogResponse> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.workLog.findMany({
        skip,
        take: limit,
        orderBy: { date: sortOrder },
        include: { workType: true },
      }),
      this.prisma.workLog.count(),
    ]);

    const hasMore = page * limit < total;

    return {
      data: data.map(mapWorkLogToResponse),
      total,
      hasMore,
    };
  }

  /**
   * Получить одну запись по ID, включая вид работ.
   */
  async findOne(id: string): Promise<WorkLogResponse> {
    const workLog = await this.prisma.workLog.findUnique({
      where: { id },
      include: { workType: true },
    });

    if (!workLog) {
      throw new NotFoundException('Запись журнала не найдена');
    }

    return mapWorkLogToResponse(workLog);
  }

  /**
   * Создать новую запись журнала.
   */
  async create(dto: CreateWorkLogDto): Promise<WorkLogResponse> {
    const workLog = await this.prisma.workLog.create({
      data: {
        date: new Date(dto.date),
        workTypeId: dto.workTypeId,
        volume: dto.volume,
        unit: dto.unit,
        performerName: dto.performerName,
      },
      include: { workType: true },
    });

    return mapWorkLogToResponse(workLog);
  }

  /**
   * Обновить существующую запись журнала.
   */
  async update(id: string, dto: UpdateWorkLogDto): Promise<WorkLogResponse> {
    await this.findOne(id);

    const data: WorkLogUncheckedUpdateInput = {};

    if (typeof dto.date === 'string') {
      data.date = new Date(dto.date);
    }
    if (typeof dto.workTypeId === 'string') {
      data.workTypeId = dto.workTypeId;
    }
    if (typeof dto.volume === 'number') {
      data.volume = dto.volume;
    }
    if (typeof dto.unit === 'string') {
      data.unit = dto.unit;
    }
    if (typeof dto.performerName === 'string') {
      data.performerName = dto.performerName;
    }

    const workLog = await this.prisma.workLog.update({
      where: { id },
      data,
      include: { workType: true },
    });

    return mapWorkLogToResponse(workLog);
  }

  /**
   * Удалить запись журнала.
   */
  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.workLog.delete({ where: { id } });
  }
}
