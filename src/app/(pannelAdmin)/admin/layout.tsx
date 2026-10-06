'use client';

import { usePathname } from 'next/navigation';

import { PropsWithChildren, useState } from 'react';

import clsx from 'clsx';

import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar/Sidebar';

import ThemeToggle from '@/layout/components/Header/components/ThemeToggle';

import { adminRoutes } from '@/constant/data';

type AdminProps = PropsWithChildren;

const AdminLayout = ({ children }: AdminProps) => {
  const pathname = usePathname();

  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const currentRoute = adminRoutes.find((route) => {
    if (route.href === '/admin') {
      return pathname === '/admin';
    }

    return pathname === route.href || pathname.startsWith(`${route.href}/`);
  });

  const currentChild = adminRoutes
    .flatMap((route) => route.children ?? [])
    .find((child) => pathname === child.href);

  const title = currentChild?.title ?? currentRoute?.title ?? 'پنل مدیریت';

  return (
    <div className="grid grid-cols-12 grid-rows-[80px_1fr]">
      {/* sidebar */}
      <Sidebar
        isOpen={isOpenSideBar}
        setIsOpenSideBar={setIsOpenSideBar}
        style={clsx(
          'fixed top-0 right-0 z-50 h-screen  w-64 ',

          ' md:col-span-2 md:row-span-2',
          ' md:w-auto md:static!'
        )}
      />

      {/* header */}
      <div className="col-span-12 flex items-center justify-between p-4 md:col-span-10">
        <div className="flex gap-x-2">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsOpenSideBar((prev) => !prev)}
            aria-label="باز و بسته کردن سایدبار"
          >
            <Menu />
          </button>
          <h2 className="text-primary">{title}</h2>
        </div>
        <ThemeToggle />
      </div>

      {/* content */}
      <div className="col-span-12 md:col-span-10">{children}</div>
    </div>
  );
};

export default AdminLayout;
