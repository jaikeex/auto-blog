import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { NextPageWithLayout } from 'types';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';

export interface TokenTopupPageProps {}

const TokenTopupPage: NextPageWithLayout<TokenTopupPageProps> = () => {
  const buttonClickHandler = async () => {
    await fetch('/api/add-tokens', {
      method: 'POST'
    });
  };

  return (
    <div>
      <h1>This is the token topup page</h1>
      <button className="btn" onClick={buttonClickHandler}>
        Add tokens
      </button>
    </div>
  );
};

TokenTopupPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

/* @ts-ignore */
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});

export default TokenTopupPage;
