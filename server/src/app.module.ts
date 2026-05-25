import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WorkLogModule } from './work-log/work-log.module';
import { WorkTypeModule } from './work-type/work-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WorkLogModule,
    WorkTypeModule,
  ],
})
export class AppModule {}
