import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

export interface TokensInfoProps {
  availableTokens?: number;
}

const TokensInfo: React.FC<TokensInfoProps> = ({ availableTokens = 0 }): JSX.Element => {
  return (
    <React.Fragment>
      <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
      <span className="pl-2">{availableTokens} tokens available</span>
    </React.Fragment>
  );
};

export default TokensInfo;
