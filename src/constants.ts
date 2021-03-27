/* eslint-disable import/no-mutable-exports */
import * as dev from './cdk-exports-dev.json';

let REGION: string;
let API_BASE_URL: string;
let S3_BUCKET_NAME = '';

if (process.env.NODE_ENV === 'production') {
  API_BASE_URL = 'https://backend-api.com';
} else {
  const DEV_API_URL = dev['next-cognito-dev'].apiUrl;
  const DEV_API_URL_WITHOUT_TRAILING_SLASH = DEV_API_URL.slice(
    0,
    DEV_API_URL.length - 1,
  );
  API_BASE_URL = DEV_API_URL_WITHOUT_TRAILING_SLASH;
  REGION = dev['next-cognito-dev'].region;
  S3_BUCKET_NAME = dev['next-cognito-dev'].bucketName;
}
export const S3_BUCKET_URL = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;
export const MAX_FILE_SIZE_BYTES = 1000000;

export {REGION, API_BASE_URL};
