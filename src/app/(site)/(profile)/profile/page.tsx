'use client';

import { ReactElement } from 'react';

import { RotatingLines } from 'react-loader-spinner';

import { useGetProfile } from '@/hook/useAuth';

import { toLocalStringShortDate } from '@/utils/toPersianDate';

const ProfilePage = (): ReactElement => {
  const { data, isPending } = useGetProfile();
  const { user } = data || {};

  if (isPending)
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  return (
    <div className="border-border text-primary bg-bg rounded-xl border p-8 shadow-xl">
      <h2 className="my-6 text-blue-500">خوش آمدی</h2>
      <h2 className="text-blue-500">{user?.name}</h2>
      <div className="my-6 flex gap-x-2 [&>span]:text-gray-400">
        <span>تاریخ پیوستن:</span>
        <span>{toLocalStringShortDate(user?.createdAt)}</span>
      </div>
    </div>
  );
};
export default ProfilePage;
