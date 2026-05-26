import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Глобальный фильтр исключений.
 * Форматирует Prisma-ошибки в HTTP-ответы, скрывает стек в 500.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    const errors: string[] = [];

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message } = this.handlePrismaError(exception));
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as Record<string, unknown>)['message'];
        message = Array.isArray(msg) ? msg.join('; ') : String(msg);

        if (Array.isArray(msg)) {
          errors.push(...msg.map(String));
        }
      } else {
        message = String(res);
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Внутренняя ошибка сервера';
      this.logger.error('Необработанное исключение', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(errors.length > 0 && { errors }),
    });
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (error.code) {
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Указанный вид работ не существует',
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Запись не найдена',
        };
      default:
        this.logger.error('Ошибка Prisma', error);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Внутренняя ошибка сервера',
        };
    }
  }
}
