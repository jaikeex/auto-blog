import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

export interface LogoProps {}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      AutoBlog
      <FontAwesomeIcon icon={faBrain} className="text-2xl text-slate-400 ml-2" />
    </div>
  );
};

export default Logo;
