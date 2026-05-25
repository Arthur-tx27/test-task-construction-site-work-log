import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WorkLogService } from './work-log.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import type {
  PaginatedWorkLogResponse,
  WorkLogResponse,
} from '../types/work-log.types';
import type { SortOrder } from '../../generated/prisma/internal/prismaNamespace';

@Controller('work-log')
export class WorkLogController {
  constructor(private readonly workLogService: WorkLogService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortOrder') sortOrder: SortOrder = 'desc',
  ): Promise<PaginatedWorkLogResponse> {
    return this.workLogService.findAll(Number(page), Number(limit), sortOrder);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkLogResponse> {
    return this.workLogService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateWorkLogDto): Promise<WorkLogResponse> {
    return this.workLogService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkLogDto,
  ): Promise<WorkLogResponse> {
    return this.workLogService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.workLogService.delete(id);
  }
}
