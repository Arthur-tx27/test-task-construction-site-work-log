import { z } from 'zod';
import { ALLOWED_UNITS } from '../consts';

/** Zod-схема валидации формы журнала работ. Валидация идентична серверной. */
export const workLogSchema = z.object({
  date: z
    .string()
    .min(1, 'Дата обязательна')
    .refine(
      (val) => !Number.isNaN(Date.parse(val)),
      'Некорректная дата',
    )
    .refine(
      (val) => new Date(val) <= new Date(),
      'Дата не может быть в будущем',
    ),
  workTypeId: z
    .string()
    .uuid('Некорректный UUID')
    .min(1, 'Вид работ обязателен'),
  volume: z
    .number()
    .positive('Объём должен быть положительным')
    .max(1_000_000, 'Объём не должен превышать 1 000 000'),
  unit: z.enum(ALLOWED_UNITS, { message: 'Недопустимая единица измерения' }),
  performerName: z
    .string()
    .min(2, 'ФИО должно быть от 2 символов')
    .max(100, 'ФИО должно быть до 100 символов')
    .regex(
      /^[а-яёА-ЯЁa-zA-Z .-]+$/,
      'ФИО содержит недопустимые символы',
    ),
});

export type WorkLogFormValues = z.infer<typeof workLogSchema>;
