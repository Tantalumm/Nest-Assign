import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error_code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;

      if (status === HttpStatus.BAD_REQUEST && (Array.isArray(body?.message) || body?.message)) {
        error_code = 'VALIDATION_ERROR';
      } else if (status === HttpStatus.NOT_FOUND) {
        error_code = 'NOT_FOUND';
      } else if (status === HttpStatus.UNAUTHORIZED) {
        error_code = 'UNAUTHORIZED';
      } else if (status === HttpStatus.FORBIDDEN) {
        error_code = 'FORBIDDEN';
      } else {
        error_code = 'HTTP_ERROR';
      }
    }

    res.status(status).json({
      successful: false,
      error_code,
      data: null,
    });
  }
}