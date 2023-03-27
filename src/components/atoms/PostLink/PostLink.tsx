import Link from 'next/link';
import * as React from 'react';

export interface PostLinkProps extends React.PropsWithChildren {
  className?: string;
  url: string;
}

const PostLink: React.FC<PostLinkProps> = ({ children = null, className = '', url = '#' }): JSX.Element => {
  return (
    <Link
      href={url}
      className={`block text-ellipsis border border-transparent overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm py-1  ${className}`}
    >
      {children}
    </Link>
  );
};

export default PostLink;
