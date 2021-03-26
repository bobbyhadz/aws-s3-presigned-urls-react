import '@styles/tailwind.css';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {StrictMode} from 'react';

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  console.log('this is the app component');
  return (
    <StrictMode>
      <Head>
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <div className="bg-gray-50">
        <Component {...pageProps} />
      </div>
    </StrictMode>
  );
};

export default App;
