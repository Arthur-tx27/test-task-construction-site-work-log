import {
  IsISO8601,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  Max,
  IsIn,
  Matches,
  Length,
} from 'class-validator';
import { ALLOWED_UNITS, ALLOWED_UNITS_MESSAGE } from '../../consts';
import { IsNotFutureDate } from '../../validators/is-not-future-date.validator';

export class CreateWorkLogDto {
  @IsISO8601(
    { strict: true },
    { message: 'Дата должна быть в формате ISO 8601' },
  )
  @IsNotEmpty({ message: 'Дата обязательна' })
  @IsNotFutureDate()
  date!: string;

  @IsUUID('4', { message: 'workTypeId должен быть UUID v4' })
  @IsNotEmpty({ message: 'Вид работ обязателен' })
  workTypeId!: string;

  @IsPositive({ message: 'Объём должен быть положительным числом' })
  @Max(1_000_000, { message: 'Объём не должен превышать 1 000 000' })
  volume!: number;

  @IsIn(ALLOWED_UNITS, { message: ALLOWED_UNITS_MESSAGE })
  @IsNotEmpty({ message: 'Единица измерения обязательна' })
  unit!: string;

  @Matches(/^[а-яёА-ЯЁa-zA-Z .-]+$/, {
    message: 'ФИО содержит недопустимые символы',
  })
  @Length(2, 100, { message: 'ФИО должно быть от 2 до 100 символов' })
  @IsNotEmpty({ message: 'ФИО исполнителя обязательно' })
  performerName!: string;
}
