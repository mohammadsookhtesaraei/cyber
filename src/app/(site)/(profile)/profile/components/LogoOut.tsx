'use client';

import { ReactElement } from 'react';

import { logOutFn } from '@/services/authServices';

const LogoOut = (): ReactElement => {
  const logOutHandler = async (): Promise<void> => {
    await logOutFn();
    window.document.location = '/';
  };

  return (
    <button
      className="cursor-pointer rounded-lg bg-blue-400 px-4 py-0.5 text-white transition-colors duration-300 hover:bg-blue-500"
      onClick={logOutHandler}
    >
      خروج از حساب کار بری
    </button>
  );
};
export default LogoOut;
