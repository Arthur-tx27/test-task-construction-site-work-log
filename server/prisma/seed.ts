import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env['DATABASE_URL'] as string;
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

const WORK_TYPES = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Бетонирование',
  'Армирование',
  'Гидроизоляция',
  'Отделка фасада',
  'Электромонтаж',
  'Сантехнические работы',
  'Устройство кровли',
  'Земляные работы',
] as const;

async function main(): Promise<void> {
  for (const name of WORK_TYPES) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Справочник видов работ заполнен');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
