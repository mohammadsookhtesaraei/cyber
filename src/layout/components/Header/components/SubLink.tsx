import Link from 'next/link';

import { ReactElement, ReactNode } from 'react';

type SubLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};
const SubLink = ({ href, children, className }: SubLinkProps): ReactElement => {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
};
export default SubLink;
