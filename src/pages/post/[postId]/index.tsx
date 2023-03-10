import * as React from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { AppLayout, AppLayoutProps } from 'components/AppLayout';
import parse from 'html-react-parser';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from 'utils/get-app-props';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePostContext } from 'store/postsContext';

export interface PostPageProps {
  title?: string;
  content?: string;
  description?: string;
  keywords?: string;
  postId?: string;
}

/* @ts-ignore */
const PostPage: NextPageWithLayout<PostPageProps> = ({
  title = '',
  content = '',
  description = '',
  keywords = '',
  postId = ''
}) => {
  const router = useRouter();
  const { deletePost } = usePostContext();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

  const deleteButtonClickHandler = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteButtonClickHandler = () => {
    setShowDeleteConfirmation(false);
  };

  const deletePostHandler = async () => {
    try {
      const response = await fetch('/api/delete-post', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ postId })
      });
      const json = await response.json();
      if (json.success) {
        deletePost(postId);
        router.replace('/post/new');
      }
    } catch (error) {}
  };

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
        {!showDeleteConfirmation && (
          <div className="my-4">
            <button onClick={deleteButtonClickHandler} className="btn bg-red-600 hover:bg-red-700">
              Delete post
            </button>
          </div>
        )}
        {!!showDeleteConfirmation && (
          <div>
            <p className="p-2 bg-red-300 text-center">Are you sure you want to delete this post?</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={cancelDeleteButtonClickHandler} className="btn bg-stone-600 hover:bg-stone-700">
                Cancel
              </button>
              <button onClick={deletePostHandler} className="btn bg-red-600 hover:bg-red-700">
                Confirm
              </button>
            </div>
          </div>
        )}
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
        created: post.created.toString(),
        ...props
      }
    };
  }
});

/* @ts-ignore */
PostPage.getLayout = (page: React.ReactElement, pageProps: AppLayoutProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default PostPage;
