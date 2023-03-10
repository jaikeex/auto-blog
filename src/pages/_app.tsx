import * as React from 'react';
import 'styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppPropsWithLayout } from 'types/page-with-layout';
import { Open_Sans, DM_Serif_Display } from '@next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';

// config.autoAddCss = false;

const openSans = Open_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans'
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif'
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <UserProvider>
      <main className={`${openSans.variable} ${dmSerifDisplay.variable} font-body`}>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </main>
    </UserProvider>
  );
}

export default MyApp;
