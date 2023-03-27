import * as React from 'react';

export interface TextAreaProps extends React.ComponentProps<'textarea'> {
  helperText?: string;
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ id = '', helperText = '', label = '', ...props }): JSX.Element => {
  return (
    <div>
      {label && (
        <label htmlFor={id}>
          <strong>{label}</strong>
        </label>
      )}
      <textarea
        maxLength={100}
        id={id}
        className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
        {...props}
      />
      {helperText && <small className="block mb-2">{helperText}</small>}
    </div>
  );
};

export default TextArea;
