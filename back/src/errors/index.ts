export class HttpErrorBase extends Error {

  public readonly status: number;
  public readonly description: string;

  constructor(statusCode: number, description: string = ''){
    super(`${statusCode} - ${description}`);
    this.status = statusCode;
    this.description = description;
  }
}

export class NotFoundError extends HttpErrorBase {
  constructor(description: string = 'Not found') {
    super(404, description);
  }
}

export class ServerError extends HttpErrorBase {
  constructor(description: string = 'Server error') {
    super(500, description);
  }
}

export class BadRequestError extends HttpErrorBase {
  constructor(description: string = 'Bad request') {
    super(400, description);
  }
}