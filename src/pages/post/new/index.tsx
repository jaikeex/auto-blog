import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import type { NextPageWithLayout } from 'types';
import { useState } from 'react';

export interface NewPostPageProps {}

const NewPostPage: NextPageWithLayout<NewPostPageProps> = (props) => {
  const [postContent, setPostContent] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/generatePost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ topic, keywords })
    });
    const json = await response.json();
    setPostContent(JSON.parse(json.post).content);
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

      <div dangerouslySetInnerHTML={{ __html: postContent }} className="max-w-screen-sm p-10"></div>
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
