import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import type {TodoAttrs} from '../types';
import {db, handleError, successResponse} from '../utils';

if (!process.env.TABLE_NAME)
  throw new Error('Environment variable TABLE_NAME is required');

export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('Event', JSON.stringify(event, null, 2));

  try {
    return await listTodos();
  } catch (error) {
    console.log('ERROR is:', error);
    return handleError(error);
  }
}

async function listTodos():
  | Promise<ReturnType<typeof successResponse>>
  | never {
  const result = await db.scan({TableName: process.env.TABLE_NAME});
  return successResponse({statusCode: 200, body: result.Items as TodoAttrs[]});
}
