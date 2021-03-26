import {RequestValidationError} from '../errors';

export function parseBody<T>(
  body: string | undefined,
  requiredPropertiesError: string,
): T {
  if (!body) {
    throw new Error(requiredPropertiesError);
  }

  return JSON.parse(body) as T;
}

export async function validateSchema<T>(validation: Promise<T>): Promise<T> {
  try {
    return await validation;
  } catch (error) {
    throw new RequestValidationError(error);
  }
}
