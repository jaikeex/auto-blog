import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { NextPageWithLayout } from 'types';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import { getAppProps } from 'utils/get-app-props';
import { GetServerSidePropsContext } from 'next';

export interface TokenTopupPageProps {}

const TokenTopupPage: NextPageWithLayout<TokenTopupPageProps> = (props) => {
  const buttonClickHandler = async () => {
    const response = await fetch('/api/add-tokens', {
      method: 'POST'
    });

    const json = await response.json();
    window.location.href = json.session.url;
  };

  return (
    <div className="flex justify-center items-center">
      <button className="btn max-w-screen-sm " onClick={buttonClickHandler}>
        Add tokens
      </button>
    </div>
  );
};

TokenTopupPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const props = await getAppProps(ctx);
    return {
      props
    };
  }
});

export default TokenTopupPage;
