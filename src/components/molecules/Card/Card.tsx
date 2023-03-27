import * as React from 'react';

export interface CardProps extends React.PropsWithChildren {
  title?: string;
}

const Card: React.FC<CardProps> = ({ children = null, title = '' }): JSX.Element => {
  return (
    <div className="p-4 my-2 border border-stone-200, rounded-md">
      <div className="text-blue-600 text-2xl font-bold">{title}</div>
      <div className="mt-2 ">{children}</div>
    </div>
  );
};

export default Card;
