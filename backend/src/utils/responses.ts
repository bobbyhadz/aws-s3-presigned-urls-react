import {CustomError, ErrorAttrs} from '../errors';

export type ResponseReturnType = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

type ResponseSuccessBody = Record<string, unknown> | Record<string, unknown>[];

export function successResponse({
  statusCode,
  body,
}: {
  statusCode: number;
  body: ResponseSuccessBody;
}): ResponseReturnType {
  return withSuccess({statusCode, body});
}

function withSuccess({
  statusCode,
  body,
}: {
  statusCode: number;
  body: ResponseSuccessBody;
}): ResponseReturnType {
  return {
    statusCode,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  };
}

export function handleError(error: unknown): ResponseReturnType {
  if (error instanceof CustomError) {
    return withErrors({
      statusCode: 400,
      body: {errors: error.serializeErrors()},
    });
  }

  if (error instanceof Error) {
    return withErrors({
      statusCode: 400,
      body: {errors: [{message: error.message}]},
    });
  }

  return withErrors({
    statusCode: 400,
    body: {errors: [{message: 'Something went wrong.'}]},
  });
}

type ResponseErrorsBody = {errors: ErrorAttrs[]};

function withErrors({
  statusCode,
  body,
}: {
  statusCode: number;
  body: ResponseErrorsBody;
}): ResponseReturnType {
  return {
    statusCode,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  };
}
