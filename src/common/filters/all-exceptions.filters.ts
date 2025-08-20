import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
@Catch() //captura todas as exceções
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage = 'Internal server error';

    const defaultError = 'Internal Server Error';

    let messages: string[] = [defaultMessage];
    let errorName = defaultError;

    if (isHttpException) {
      const responseData = exception.getResponse();
      if (typeof responseData === 'string') {
        messages = [responseData];
      }

      if (typeof responseData === 'object' && responseData !== null) {
        const { message, error } = responseData as Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        messages = Array.isArray(message) ? (message as string[]) : [message];
        if (typeof error === 'string') {
          errorName = error;
        }
      }
    }

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Erro interno inesperado`,
        (exception as Error).stack || 'sem stack',
      );
    } else {
      this.logger.warn(`${status} - ${errorName}: ${messages.join(' | ')}`);
    }
    // Ensure messages is always an array of strings
    response.status(status).json({
      message: messages,
      error: errorName,
      statusCode: status,
    });
  }
}
/*
{
  "message": "Cannot GET //upload/2025-08-19/1755626567086-xrqfoho2ni.png",
  "error": "Not Found",
  "statusCode": 404
}

{
  "message": ["Nome não pode estar vazio",],
  "error": "Bad Request",
  "statusCode": 400
}

{
"statusCode": 500,
"message": "Internal server error",
}

*/
