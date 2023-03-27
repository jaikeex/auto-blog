import Link from 'next/link';
import * as React from 'react';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { Avatar } from 'components/atoms';

export interface UserInfoProps {
  className?: string;
  user: UserProfile;
}

const UserPanel: React.FC<UserInfoProps> = ({ className = '', user }): JSX.Element => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!!user ? (
        <React.Fragment>
          <div className="min-w -[50px]">
            <Avatar user={user} />
          </div>
          <div className="flex-1 ">
            <div className="font-bold">{user.email}</div>
            <Link href="/api/auth/logout" className="text-sm ">
              Logout
            </Link>
          </div>
        </React.Fragment>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </div>
  );
};

export default UserPanel;
