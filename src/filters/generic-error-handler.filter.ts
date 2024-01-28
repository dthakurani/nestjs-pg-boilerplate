import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorMessageSerializerFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errorResponse = exception.getResponse() as any;
    let errorMessages = [];
    let errorMessage = 'Something went wrong, please try again!';
    let errorField = null;

    try {
      if (
        errorResponse.message &&
        Array.isArray(errorResponse.message) &&
        errorResponse.message.length > 0
      ) {
        errorMessages = errorMessages.concat(errorResponse.message);
        errorField = errorMessages[0].split(' ')[0];
        errorMessage = errorMessages[0];
      } else if (errorResponse.type === 'customException') {
        console.log('error');

        errorMessage = errorResponse.error;
        errorField = errorResponse.errorKey;
      } else if (typeof errorResponse === 'string') {
        errorMessage = errorResponse;
      } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      }

      const serializedError = {
        statusCode: exception.getStatus(),
        message: errorMessage,
        errorField: errorField,
        messages: errorMessages,
        timestamp: new Date().toISOString(),
      };

      serializedError.message += '!';

      response.status(exception.getStatus()).json(serializedError);
    } catch (error) {
      console.error(error);
      response.status(500).json({
        statusCode: 500,
        message: 'Something went wrong, please try again!',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
