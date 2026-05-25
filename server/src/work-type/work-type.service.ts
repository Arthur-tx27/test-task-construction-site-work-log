import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { WorkTypeResponse } from '../types/work-type.types';

@Injectable()
export class WorkTypeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить все виды работ из справочника.
   */
  async findAll(): Promise<WorkTypeResponse[]> {
    const workTypes = await this.prisma.workType.findMany({
      orderBy: { name: 'asc' },
    });

    return workTypes.map(({ id, name }) => ({ id, name }));
  }
}
