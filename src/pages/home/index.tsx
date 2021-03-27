import {FormEvent} from 'react';
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (fileType && fileContents) {
        const result = await uploadToS3({fileType, fileContents});
        console.log('result is', result);
        fileDispatch({type: 'RESET_FILE_STATE'});
      }
      console.log('there is no file selected.');
    } catch (err) {
      console.log('Error is ', err);
    }
  };
  return (
    <>
      <div className="flex justify-center max-w-3xl">
        <h1 className="text-3xl">Upload files using the input below:</h1>

        <div>
          <span className="block text-sm font-medium text-gray-700">Photo</span>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mt-2">
              {/* <span className="inline-block w-12 h-12">
                <Avatar src={user?.picture || ''} />
              </span> */}

              <label
                htmlFor="picture"
                className="px-5 py-1 ml-4 bg-white border rounded-lg shadow cursor-pointer hover:bg-purple-600 hover:text-white"
              >
                <span className="mt-2 text-base leading-normal">
                  {fileName || 'Change'}
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
