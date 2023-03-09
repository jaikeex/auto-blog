import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import type { NextPageWithLayout } from 'types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getAppProps } from 'utils/get-app-props';

export interface NewPostPageProps {}

const NewPostPage: NextPageWithLayout<NewPostPageProps> = (props) => {
  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const router = useRouter();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/generate-post`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ topic, keywords })
    });
    const json = await response.json();
    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    }
  };

  const topicInputChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(event.target.value);
  };
  const keywordsInputChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(event.target.value);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="topic">
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            value={topic}
            onChange={topicInputChangeHandler}
            id="topic"
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="keywords">
            <strong>Targeting the following keywords (separated by comma):</strong>
          </label>
          <textarea
            value={keywords}
            onChange={keywordsInputChangeHandler}
            id="keywords"
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Generate
        </button>
      </form>
    </div>
  );
};

NewPostPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
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

export default NewPostPage;
