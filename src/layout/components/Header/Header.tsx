'use client';

import Link from 'next/link';

import { ReactElement } from 'react';

import ThemeToggle from './components/ThemeToggle';

const Header = (): ReactElement => {
  return (
    <header className="border-b-border flex justify-center gap-x-6 border-b py-8">
      <Link href="/">خانه</Link>
      <Link href="/auth">ثبت نام</Link>

      <Link href="/profile">پروفایل کاربری</Link>
      <Link href="/check-profile">چک پروفایل</Link>
      <Link href="/admin">ادمین</Link>

      <ThemeToggle />
    </header>
  );
};

export default Header;
