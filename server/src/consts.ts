/** Допустимые единицы измерения для объёма работ */
export const ALLOWED_UNITS = ['м³', 'м²', 'п.м.', 'т', 'шт.', 'л'] as const;

/** Тип допустимой единицы измерения */
export type AllowedUnit = (typeof ALLOWED_UNITS)[number];

export const ALLOWED_UNITS_MESSAGE =
  'Допустимые единицы измерения: ' + ALLOWED_UNITS.join(', ');
