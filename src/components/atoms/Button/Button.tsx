import * as React from 'react';

export interface ButtonProps extends React.PropsWithChildren, React.ComponentProps<'button'> {}

const Button: React.FC<ButtonProps> = ({ children = null, className = '', ...props }): JSX.Element => {
  return (
    <button type="submit" className={className ? `btn ${className}` : 'btn'} {...props}>
      {children}
    </button>
  );
};

export default Button;
