import {FormEvent, useState} from 'react';
import {S3_BUCKET_URL} from 'src/constants';
import {uploadToS3} from './upload-file';
import {useFileChange} from './use-file-change';

const Home: React.FC = () => {
  const {
    fileError,
    fileName,
    fileContents,
    fileType,
    fileDispatch,
    handleFileChange,
  } = useFileChange();
  const [s3FileUrl, setS3FileUrl] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({fileType, fileContents});
        setS3FileUrl(`${S3_BUCKET_URL}/${filePath}`);
        console.log('filePath is', filePath);
        fileDispatch({type: 'RESET_FILE_STATE'});
      }
      console.log('there is no file selected.');
    } catch (err) {
      console.log('Error is ', err);
    }
  };
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center mt-40">
          <h1 className="max-w-xl text-3xl">
            Upload files using the input below:
          </h1>
          {fileError && (
            <h1 className="max-w-3xl text-3xl text-red-600">{fileError}</h1>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center mt-2">
                <label
                  htmlFor="picture"
                  className="px-5 py-1 mt-6 bg-white border rounded-lg shadow cursor-pointer hover:bg-purple-600 hover:text-white"
                >
                  <span className="mt-2 text-base leading-normal">
                    {fileName || 'File Input'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    id="picture"
                    name="picture"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  type="submit"
                  className="px-1 py-2 my-6 border-2 border-green-400 rounded-md hover:bg-green-50"
                >
                  Upload to s3
                </button>
              </div>
            </form>
            <span className="inline-block w-96 h-96">
              <img src={s3FileUrl || ''} alt="" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
