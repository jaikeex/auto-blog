import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { NextPageWithLayout } from 'types';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import { getAppProps } from 'utils/get-app-props';
import { GetServerSidePropsContext } from 'next';

export interface SuccessPageProps {}

const SuccessPage: NextPageWithLayout<SuccessPageProps> = (props) => {
  return (
    <div className="w-full flex justify-center items-center h-screen max-h-80">
      <h1>Thank you for your purchase!</h1>
    </div>
  );
};

SuccessPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
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

export default SuccessPage;
