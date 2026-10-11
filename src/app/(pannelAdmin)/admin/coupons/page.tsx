'use client';

import Link from 'next/link';

import { RotatingLines } from 'react-loader-spinner';

import { useGetCoupons } from '@/hook/useCoupon';

import CouponTable from '@/app/(pannelAdmin)/admin/coupons/components/CouponTable';

const Coupons = () => {
  const { data, isPending } = useGetCoupons();
  const { coupons } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="my-2 flex w-fit items-center rounded-md bg-linear-180 from-[#2d2468] to-[#1b1640] p-2 text-white">
        <Link href="/admin/coupons/add">اضافه کردن کد تخفیف</Link>
      </div>
      <CouponTable coupons={coupons} />
    </div>
  );
};
export default Coupons;
