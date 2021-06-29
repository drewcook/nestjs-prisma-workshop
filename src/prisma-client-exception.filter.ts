import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Prisma client error codes
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
    const uniqueConstraintErrorCode = 'P2002';
    // Return the proper HTTP status codes for unique prisma error codes
    switch (exception.code) {
      case uniqueConstraintErrorCode:
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: exception.message.replace(/\n/g, ''),
        });
        break;
      default:
        // Default 500 errors here
        super.catch(exception, host);
        break;
    }
  }
}
