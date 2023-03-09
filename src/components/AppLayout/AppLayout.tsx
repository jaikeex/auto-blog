import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Logo } from 'components/Logo';
import { Post } from 'types/post';

export interface AppLayoutProps extends React.PropsWithChildren {
  availableTokens?: number;
  posts: Post[];
  postId?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children = null, availableTokens = 0, posts = [], postId = '' }) => {
  const { user } = useUser();
  console.log(posts);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-2">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="px-4 py-6 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`block text-ellipsis border border-transparent overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm py-1  ${
                postId === post._id ? 'bg-white/20 border-white' : ''
              }`}
            >
              {post.title}
            </Link>
          ))}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <React.Fragment>
              <div className="min-w -[50px]">
                <Image src={user.picture} alt={user.name} height={50} width={50} className="rounded-full" />
              </div>
              <div className="flex-1 ">
                <div className="font-bold">{user.email}</div>
                <Link href="/api/auth/logout" className="text-sm ">
                  Logout
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
