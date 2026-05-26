import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Prisma } from '@prisma/client';

export class WorkLogQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'page должен быть целым числом' })
  @Min(1, { message: 'page должен быть >= 1' })
  page!: number;

  @Type(() => Number)
  @IsInt({ message: 'limit должен быть целым числом' })
  @Min(1, { message: 'limit должен быть >= 1' })
  @Max(100, { message: 'limit должен быть <= 100' })
  limit!: number;

  @IsIn(['asc', 'desc'], { message: 'sortOrder должен быть asc или desc' })
  sortOrder!: Prisma.SortOrder;

  @IsOptional()
  workTypeId?: string;

  @IsOptional()
  date?: string;
}
