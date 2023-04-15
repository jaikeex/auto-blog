import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout, Button, TextArea, Loader } from 'components';
import type { AppLayoutProps } from 'components';
import type { NextPageWithLayout } from 'types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getAppProps } from 'utils/get-app-props';

const NewPostPage: NextPageWithLayout = () => {
  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-post`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic, keywords })
      });
      const json = await response.json();
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const topicInputChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(event.target.value);
  };
  const keywordsInputChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(event.target.value);
  };

  return (
    <div className="h-full overflow-hidden">
      {loading && <Loader />}
      {!loading && (
        <div className="w-full h-full flex flex-col overflow-auto ">
          <form
            onSubmit={submitHandler}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <TextArea
              label="Generate a blog post on the topic of:"
              value={topic}
              onChange={topicInputChangeHandler}
              id="topic"
            />
            <TextArea
              label="Targeting the following keywords:"
              helperText="(Separate individual keywords with a comma)"
              value={keywords}
              onChange={keywordsInputChangeHandler}
              id="keywords"
            />
            <Button disabled={!topic.trim() || !keywords.trim()}>Generate</Button>
          </form>
        </div>
      )}
    </div>
  );
};

NewPostPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false
        }
      };
    }

    return {
      props
    };
  }
});

export default NewPostPage;
