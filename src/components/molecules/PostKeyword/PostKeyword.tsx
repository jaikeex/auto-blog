import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from 'components/atoms';
import * as React from 'react';

export interface PostKeywordProps extends React.PropsWithChildren {}

const PostKeyword: React.FC<PostKeywordProps> = ({ children = null }): JSX.Element => {
  return (
    <Chip>
      <FontAwesomeIcon icon={faHashtag} className="mr-1" size="xs" />
      {children}
    </Chip>
  );
};

export default PostKeyword;
