import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import type { NextPageWithLayout } from 'types';

export interface NewPostPageProps {}

const NewPostPage: NextPageWithLayout<NewPostPageProps> = (props) => {
  return (
    <div>
      <h1>This is the new post page</h1>
    </div>
  );
};

NewPostPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});

export default NewPostPage;
