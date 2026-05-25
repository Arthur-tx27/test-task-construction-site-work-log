/**
 * Базовый URL API-сервера.
 * Устанавливается через NEXT_PUBLIC_API_URL (локально — .env.local, в Docker — build-arg).
 */
export const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] as string;

/** Количество записей на странице */
export const ITEMS_PER_PAGE = 10;

/** Допустимые единицы измерения для объёма работ */
export const ALLOWED_UNITS = ['м³', 'м²', 'п.м.', 'т', 'шт.', 'л'] as const;

/** Тип допустимой единицы измерения */
export type AllowedUnit = (typeof ALLOWED_UNITS)[number];
