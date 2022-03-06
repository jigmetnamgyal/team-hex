import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ChakraProvider } from '@chakra-ui/react';
import { NAVIGATION } from '../constants/mint-check.constants';
import { Layout } from '@team-hex/ui-kit';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to mint-check!</title>
      </Head>
      <ChakraProvider>
        <main className='app'>
          <Layout navigationItems={NAVIGATION}>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
