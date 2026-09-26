import { StatusCodes } from 'http-status-codes';

export function fail(statusCode: StatusCodes, message: string): never {
  throw Object.assign(new Error(message), { statusCode });
}
