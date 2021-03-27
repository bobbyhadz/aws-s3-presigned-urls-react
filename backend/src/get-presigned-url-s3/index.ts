import type {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import {S3} from 'aws-sdk';

if (!process.env.BUCKET_NAME)
  throw new Error('Environment variable Bucket name is required.');

type Event = APIGatewayProxyEventV2 & {
  queryStringParameters: {fileType: string};
};

export async function main(event: Event): Promise<APIGatewayProxyResultV2> {
  console.log('Event is', JSON.stringify(event, null, 2));
  try {
    if (!event.queryStringParameters?.fileType)
      throw new Error(
        'Querystring parameter fileType must be provided when creating a presigned URL, i.e. ?fileType=image/png',
      );

    const {fileType} = event.queryStringParameters;
    const filePath = generateId();
    const presignedPost = await createPresignedPost({fileType, filePath});

    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...presignedPost,
        filePath,
      }),
    };
  } catch (error: unknown) {
    console.log('ERROR is:', error);
    if (error instanceof Error) {
      return {statusCode: 400, body: JSON.stringify({error: error.message})};
    }
    return {
      statusCode: 400,
      body: JSON.stringify({error: JSON.stringify(error)}),
    };
  }
}

type GetPresignedPostUrlParams = {
  fileType: string;
  filePath: string;
};

export function createPresignedPost({
  fileType,
  filePath,
}: GetPresignedPostUrlParams): Promise<S3.PresignedPost> {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Fields: {key: filePath, acl: 'public-read'},
    Conditions: [
      // content length restrictions: 0-1MB]
      ['content-length-range', 0, 1000000],
      // specify content-type to be more generic- images only
      // ['starts-with', '$Content-Type', 'image/'],
      ['eq', '$Content-Type', fileType],
    ],
    // number of seconds for which the presigned policy should be valid
    Expires: 15,
  };

  const s3 = new S3();
  return (s3.createPresignedPost(
    params,
  ) as unknown) as Promise<S3.PresignedPost>;
}

function generateId() {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-.*()';
  const length = 10;

  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `${date}_${result}`;
}
