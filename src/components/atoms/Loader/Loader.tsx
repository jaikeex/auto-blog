import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

const Loader: React.FC = (): JSX.Element => {
  return (
    <div className="text-green-500 flex h-full w-full flex-col justify-center items-center">
      <FontAwesomeIcon icon={faBrain} className="text-8xl animate-pulse" />
      <h6>Loading...</h6>
    </div>
  );
};

export default Loader;
