import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import {BadRequestError} from '../errors';
import {TodoAttrs} from '../types';
import {
  db,
  handleError,
  parseBody,
  successResponse,
  validateSchema,
} from '../utils';
/* eslint-disable import/extensions, import/no-absolute-path */
import {Asserts, object, string} from '/opt/nodejs/yup-utils';

if (!process.env.TABLE_NAME)
  throw new Error('Environment variable TABLE_NAME is required');

const ValidationSchema = object().shape({
  text: string().trim().required(),
});

type Body = Pick<Asserts<typeof ValidationSchema>, 'text'>;

export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('Event', JSON.stringify(event, null, 2));
  try {
    const body = parseBody<Body>(event.body, 'Field text is required.');
    const {text} = await validateSchema(
      ValidationSchema.validate(body, {abortEarly: false}),
    );

    return await createTodo({text});
  } catch (error) {
    console.log('ERROR IS: ', error);
    return handleError(error);
  }
}

type CreateTodoParams = {
  text: string;
};

async function createTodo({
  text,
}: CreateTodoParams): Promise<ReturnType<typeof successResponse>> {
  const todo: TodoAttrs = {
    id: (Math.random() + Date.now()).toString(),
    text,
    completed: false,
  };

  try {
    await db.put({TableName: process.env.TABLE_NAME, Item: todo});

    return successResponse({statusCode: 201, body: todo});
  } catch (error) {
    console.log('Create Error is: ', error);
    if (error instanceof Error) {
      throw new BadRequestError(error.message);
    }
    throw error;
  }
}
