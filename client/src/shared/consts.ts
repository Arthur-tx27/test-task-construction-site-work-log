export const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] as string;

export const ITEMS_PER_PAGE = 10;

export const ALLOWED_UNITS = ['м³', 'м²', 'п.м.', 'т', 'шт.', 'л'] as const;

export type AllowedUnit = (typeof ALLOWED_UNITS)[number];
