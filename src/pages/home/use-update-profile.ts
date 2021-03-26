/* eslint-disable camelcase */
import type {UpdatableUserAttributes} from '@context/auth/auth-reducer';
import {useAsync} from '@hooks/use-async';
import {uploadToS3} from './upload-file';
import {useFileChange} from './use-file-change';

export function useUpdateProfile({
  updateUserAttributes,
}: {
  updateUserAttributes: (attributesToUpdate: UpdatableUserAttributes) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    error,
    status,
    isLoading,
    isSuccess,
    isError,
    run,
    setError,
  } = useAsync();

  const {
    fileError,
    fileName,
    fileContents,
    fileType,
    fileDispatch,
    handleFileChange,
  } = useFileChange();

  const onSubmit = () => {
    run(uploadToS3AndUpdateProfileAttributes());

    async function uploadToS3AndUpdateProfileAttributes() {
      let filePath = '';
      if (fileContents && fileType) {
        filePath = await uploadToS3({fileType, fileContents});
        fileDispatch({type: 'RESET_FILE_STATE'});
      }
    }
  };

  return {
    handleFileChange,
    fileError,
    fileName,
    isLoading,
    error,
    isError,
    isSuccess,
    status,
  };
}
