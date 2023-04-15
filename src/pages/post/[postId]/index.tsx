import * as React from 'react';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import parse from 'html-react-parser';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import { getAppProps } from 'utils/get-app-props';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { usePostContext } from 'store/postsContext';
import { Button, Alert, Post, AppLayout } from 'components';
import type { AppLayoutProps } from 'components';

export interface PostPageProps {
  title?: string;
  content?: string;
  description?: string;
  keywords?: string;
  postId?: string;
}

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
        <Post description={description} keywords={keywords} title={title}>
          {parse(content)}
        </Post>
        {!showDeleteConfirmation && (
          <div className="my-4">
            <Button onClick={deleteButtonClickHandler} className="bg-red-600 hover:bg-red-700">
              Delete post
            </Button>
          </div>
        )}
        {!!showDeleteConfirmation && (
          <div>
            <Alert>Are you sure you want to delete this post?</Alert>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={cancelDeleteButtonClickHandler} className="bg-stone-600 hover:bg-stone-700">
                Cancel
              </Button>
              <Button onClick={deletePostHandler} className="bg-red-600 hover:bg-red-700">
                Confirm
              </Button>
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
