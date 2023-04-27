export class ApplicationError extends Error {
  public error: string;
  public statusCode: number;
  public details: string[] | [];

  public constructor(code: number, error: string, message: string, details: string[] | [] = []) {
    super(message);
    this.error = error;
    this.statusCode = code;
    this.details = details;
  }
}
