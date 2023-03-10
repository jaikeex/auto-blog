import * as React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from 'components/AppLayout';
import type { AppLayoutProps } from 'components/AppLayout';
import type { NextPageWithLayout } from 'types';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getAppProps } from 'utils/get-app-props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

export interface NewPostPageProps {}

const NewPostPage: NextPageWithLayout<NewPostPageProps> = (props) => {
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
      {loading && (
        <div className="text-green-500 flex h-full w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl animate-pulse" />
          <h6>Generating...</h6>
        </div>
      )}
      {!loading && (
        <div className="w-full h-full flex flex-col overflow-auto ">
          <form
            onSubmit={submitHandler}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <div>
              <label htmlFor="topic">
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                value={topic}
                onChange={topicInputChangeHandler}
                id="topic"
                maxLength={100}
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              ></textarea>
            </div>
            <div>
              <label htmlFor="keywords">
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                value={keywords}
                onChange={keywordsInputChangeHandler}
                id="keywords"
                maxLength={100}
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              ></textarea>
              <small className="block mb-2">Separate keywords with a comma</small>
            </div>
            <button type="submit" className="btn" disabled={!topic.trim() || !keywords.trim()}>
              Generate
            </button>
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
