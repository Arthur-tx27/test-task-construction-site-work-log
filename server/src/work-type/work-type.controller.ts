import { Controller, Get } from '@nestjs/common';
import { WorkTypeService } from './work-type.service';
import type { WorkTypeResponse } from '../types/work-type.types';

@Controller('work-type')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Get()
  async findAll(): Promise<WorkTypeResponse[]> {
    return this.workTypeService.findAll();
  }
}
