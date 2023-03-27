import Image from 'next/image';
import * as React from 'react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

export interface AvatarProps {
  user: UserProfile;
}

const Avatar: React.FC<AvatarProps> = ({ user }): JSX.Element => {
  return <Image src={user.picture} alt={user.name} height={50} width={50} className="rounded-full" />;
};

export default Avatar;
