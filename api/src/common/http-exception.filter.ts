import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // @ts-expect-error Object Type Erro
      message = typeof res === "string" ? res : res.message || message;
    }

    response.status(status).json({
      success: false,
      message
    });
  }
}
