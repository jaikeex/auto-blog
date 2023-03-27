import * as React from 'react';

export interface AlertProps extends React.PropsWithChildren {}

const Alert: React.FC<AlertProps> = ({ children = null }): JSX.Element => {
  return <p className="p-2 bg-red-300 text-center">{children}</p>;
};

export default Alert;
