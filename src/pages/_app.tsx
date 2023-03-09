import * as React from 'react';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppPropsWithLayout } from 'types/page-with-layout';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>;
}

export default MyApp;
