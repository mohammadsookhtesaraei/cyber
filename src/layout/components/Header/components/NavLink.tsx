import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ReactNode } from 'react';

import clsx from 'clsx';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};
const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  const pathName = usePathname();
  const isActive = pathName === href;
  return (
    <Link
      onClick={onClick}
      className={clsx(className, isActive ? 'text-black' : 'text-black/30')}
      href={href}
    >
      {children}
    </Link>
  );
};
export default NavLink;
