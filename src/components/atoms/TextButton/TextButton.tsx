import * as React from 'react';

export interface TextButtonProps extends React.PropsWithChildren {
  className?: string;
  onClick?: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
  children = null,
  className = '',
  onClick = () => {}
}): JSX.Element => {
  return (
    <div onClick={onClick} className={`hover: underline text-sm text-slate-400 cursor-pointer ${className}`}>
      {children}
    </div>
  );
};

export default TextButton;
