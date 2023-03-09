import * as React from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AppLayout } from 'components/AppLayout';
import parse from 'html-react-parser';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from 'utils/get-app-props';

export interface PostPageProps {
  title?: string;
  content?: string;
  description?: string;
  keywords?: string;
}

const PostPage: NextPageWithLayout<PostPageProps> = ({
  title = '',
  content = '',
  description = '',
  keywords = '',
  ...props
}) => {
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">Title and description</div>
        <div className="p-4 my-2 border border-stone-200, rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{title}</div>
          <div className="mt-2 ">{description}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">Keywords</div>
        <div className="flex flex-wrap pt-2 gap-1">
          {keywords.split(',').map((keyword, index) => (
            <div key={index} className="rounded-full p-2 bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} className="mr-1" />
              {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">Blog post</div>
        <div>{parse(content)}</div>
      </div>
    </div>
  );
};

/* @ts-ignore */
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('autoblog');

    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    });

    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId as string),
      userId: user._id
    });

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false
        }
      };
    }

    return {
      props: {
        title: post.title,
        content: post.content,
        description: post.description,
        keywords: post.keywords,
        ...props
      }
    };
  }
});

PostPage.getLayout = (page: React.ReactElement, pageProps: PostPageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default PostPage;
