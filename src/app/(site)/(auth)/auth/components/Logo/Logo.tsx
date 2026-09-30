import Image from 'next/image';

import { ReactElement } from 'react';

import Log from '@/assets/images/Logo.webp';

const Logo = (): ReactElement => {
  return (
    <div className="mb-7 w-full">
      <Image
        className="mx-auto block h-8.5 w-25 dark:invert"
        src={Log}
        width={100}
        height={34}
        alt="logo"
        loading="eager"
      />
    </div>
  );
};
export default Logo;
