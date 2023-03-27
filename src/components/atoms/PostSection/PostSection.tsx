import * as React from 'react';

export interface PostSectionProps extends React.PropsWithChildren, React.ComponentProps<'div'> {}

const PostSection: React.FC<PostSectionProps> = ({ children = null, ...props }): JSX.Element => {
  return (
    <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm" {...props}>
      {children}
    </div>
  );
};

export default PostSection;
