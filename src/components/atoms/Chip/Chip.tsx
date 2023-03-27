import * as React from 'react';

export interface ChipProps extends React.PropsWithChildren, React.ComponentProps<'div'> {}

const Chip: React.FC<ChipProps> = ({ children = null, ...props }): JSX.Element => {
  return (
    <div className="rounded-full p-1 bg-slate-800 text-white" {...props}>
      {children}
    </div>
  );
};

export default Chip;
