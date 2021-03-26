import {Avatar} from '@components/avatar';

const Home: React.FC = () => {
  return (
    <>
      <div className="flex justify-center max-w-3xl">
        <h1 className="text-3xl">Upload files using the input below:</h1>

        <div>
          <span className="block text-sm font-medium text-gray-700">Photo</span>
          <div className="flex items-center mt-2">
            <span className="inline-block w-12 h-12">
              <Avatar src={user?.picture || ''} />
            </span>

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
            <button
              type="button"
              onClick={handleClearPictureAttribute}
              color="secondary"
              className="p-1 ml-4 border-4 border-transparent focus:outline-none"
              disabled={!user?.picture}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
