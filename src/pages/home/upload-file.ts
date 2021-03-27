import axios from 'axios';
import {API_BASE_URL, S3_BUCKET_URL} from 'src/constants';

export async function uploadToS3({
  fileType,
  fileContents,
}: {
  fileType: string;
  fileContents: File;
}) {
  console.log('fileType is ', fileType);
  console.log('fileContents is', fileContents);
  const presignedPostUrl = await getPresignedPostUrl(fileType);

  console.log('presignedPostUrl is', presignedPostUrl);

  const formData = new FormData();
  formData.append('Content-Type', fileType);
  Object.entries(presignedPostUrl.fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append('file', fileContents); // The file has be the last element

  console.log('formData is', formData);

  const response = await axios.post(presignedPostUrl.url, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  console.log('response is', response);

  console.log(`${S3_BUCKET_URL}/${presignedPostUrl.filePath}`);

  return presignedPostUrl.filePath;
}

type PresignedPostUrlResponse = {
  url: string;
  fields: {
    key: string;
    acl: string;
    bucket: string;
  };
  filePath: string;
};

const GET_PRESIGNED_URL_API_PATH = 'get-presigned-url-s3';

async function getPresignedPostUrl(fileType: string) {
  const {data: presignedPostUrl} = await axios.get<PresignedPostUrlResponse>(
    `${API_BASE_URL}/${GET_PRESIGNED_URL_API_PATH}?fileType=${fileType}`,
  );

  return presignedPostUrl;
}
