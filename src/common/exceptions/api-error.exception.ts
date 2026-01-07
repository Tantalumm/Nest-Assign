import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiErrorException extends HttpException {
  constructor(error_code: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ error_code }, status);
  }
}