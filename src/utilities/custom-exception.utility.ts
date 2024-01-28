import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(error: string, errorKey: any, statusCode: HttpStatus) {
    super({ error, errorKey, type: 'customException' }, statusCode);
  }
}
