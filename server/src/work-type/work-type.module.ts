import { Module } from '@nestjs/common';
import { WorkTypeService } from './work-type.service';
import { WorkTypeController } from './work-type.controller';

@Module({
  controllers: [WorkTypeController],
  providers: [WorkTypeService],
})
export class WorkTypeModule {}
