import Link from 'next/link';

import { ReactElement } from 'react';

import LogoOut from '@/app/(site)/(profile)/profile/components/LogoOut';

const ProfileSideBar = (): ReactElement => {
  return (
    <div className="col-span-1">
      <div className="border-border text-primary bg-bg rounded-xl border p-4 shadow-xl">
        <ul>
          <li>
            <Link
              className="transition-colors duration-300 hover:text-blue-400"
              href="/"
            >
              خانه
            </Link>
          </li>
          <li>
            <Link
              className="transition-colors duration-300 hover:text-blue-400"
              href="/profile"
            >
              صفحه کاربری
            </Link>
          </li>
        </ul>
        <LogoOut />
      </div>
    </div>
  );
};
export default ProfileSideBar;
