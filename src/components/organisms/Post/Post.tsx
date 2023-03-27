import { PostSection } from 'components/atoms';
import { Card } from 'components/molecules';
import { PostKeyword } from 'components/molecules';
import * as React from 'react';

export interface PostProps extends React.PropsWithChildren {
  description?: string;
  keywords?: string;
  title?: string;
}

const Post: React.FC<PostProps> = ({ children = null, description = '', keywords = '', title = '' }): JSX.Element => {
  return (
    <React.Fragment>
      <PostSection>Title and description</PostSection>
      <Card title={title}>{description}</Card>
      <PostSection>Keywords</PostSection>
      <div className="flex flex-wrap pt-2 gap-1">
        {keywords.split(',').map((keyword, index) => (
          <PostKeyword key={index}>{keyword}</PostKeyword>
        ))}
      </div>
      <PostSection>Blog post</PostSection>
      <div>{children}</div>
    </React.Fragment>
  );
};

export default Post;
