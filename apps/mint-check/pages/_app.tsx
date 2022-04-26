import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ChakraProvider } from '@chakra-ui/react';
import { NAVIGATION } from '../constants/mint-check.constants';
import { Layout } from '@team-hex/ui-kit';
import { Provider as WagmiProvider } from 'wagmi';
import { connectors } from '../components/wagmi-set-up/wagmi-set-up';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to mint-check!</title>
      </Head>
      <ChakraProvider>
        <WagmiProvider connectors={connectors}>
          <main className='app'>
            <Layout navigationItems={NAVIGATION}>
              <Component {...pageProps} />
            </Layout>
          </main>
        </WagmiProvider>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
