'use client';

import { ReactElement } from 'react';

import { CalendarDays, Sparkles, UserRound } from 'lucide-react';

import { RotatingLines } from 'react-loader-spinner';

import { useGetProfile } from '@/hook/useAuth';

import { toLocalStringShortDate } from '@/utils/toPersianDate';

const ProfilePage = (): ReactElement => {
  const { data, isPending } = useGetProfile();
  const { user } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
        <RotatingLines
          visible={true}
          height="48"
          width="48"
          color="gray"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="from-primary-900 to-primary-700 relative overflow-hidden bg-gradient-to-l px-6 py-10 sm:px-10">
        <div className="absolute -top-14 -left-10 size-44 rounded-full bg-white/5" />
        <div className="absolute right-1/3 -bottom-20 size-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm">
            <UserRound className="size-10" strokeWidth={1.5} />
          </div>

          <div className="text-center sm:text-right">
            <div className="mb-2 flex items-center justify-center gap-2 text-sm text-white/70 sm:justify-start">
              <Sparkles className="size-4" />
              <span>پنل کاربری شما</span>
            </div>

            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              خوش آمدی، {user?.name || 'کاربر عزیز'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/70">
              از حضور دوباره‌ات خوشحالیم.
            </p>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <div className="p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            اطلاعات حساب کاربری
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            اطلاعات پایه حساب خود را مشاهده کن.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5 transition-colors hover:border-gray-200">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound className="size-6" />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-sm text-gray-500">نام کاربر</p>
              <p className="truncate font-semibold text-gray-800">
                {user?.name || 'ثبت نشده'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5 transition-colors hover:border-gray-200">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarDays className="size-6" />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-sm text-gray-500">تاریخ پیوستن</p>
              <p className="font-semibold text-gray-800">
                {user?.createdAt
                  ? toLocalStringShortDate(user.createdAt)
                  : 'نامشخص'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
