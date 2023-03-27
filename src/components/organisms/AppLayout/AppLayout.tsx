import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Logo } from 'components/molecules';
import { Post } from 'types/post';
import { usePostContext } from 'store/postsContext';
import { Button } from 'components/atoms';
import { TokensInfo } from 'components/molecules';
import { PostLink } from 'components/atoms';
import { UserPanel } from 'components/molecules';
import { TextButton } from 'components/atoms';

export interface AppLayoutProps extends React.PropsWithChildren {
  availableTokens?: number;
  posts: Post[];
  postId?: string;
  created?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children = null,
  availableTokens = 0,
  posts: postsFromSSR = [],
  postId = '',
  created = ''
}) => {
  const { user } = useUser();

  const { setPostsFromSSR, loadPosts, posts, allPostsLoaded } = usePostContext();
  const loadPostsClickHandler = () => {
    loadPosts(posts.at(-1).created);
  };

  useEffect(() => {
    if (postId && !postsFromSSR.find((post) => post._id === postId)) {
      loadPosts(created, true);
    }
    setPostsFromSSR(postsFromSSR);
  }, [postId, postsFromSSR, setPostsFromSSR, created, loadPosts]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new">
            <Button>New post</Button>
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <TokensInfo availableTokens={availableTokens} />
          </Link>
        </div>
        <div className="px-4 py-6 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <PostLink
              key={post._id}
              url={`/post/${post._id}`}
              className={postId === post._id ? 'bg-white/20 border-white' : ''}
            >
              {post.title}
            </PostLink>
          ))}
          <TextButton onClick={loadPostsClickHandler} className={`text-center mt-4 ${allPostsLoaded && 'hidden'}`}>
            Load more posts
          </TextButton>
        </div>
        <UserPanel user={user} className="bg-cyan-800 border-t border-t-black/50 h-20 px-2" />
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
