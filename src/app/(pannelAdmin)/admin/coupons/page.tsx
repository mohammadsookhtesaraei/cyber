'use client';

import Link from 'next/link';

const Coupons = () => {
  return (
    <div className="px-4">
      <div className="my-2 flex w-fit items-center rounded-md bg-linear-180 from-[#2d2468] to-[#1b1640] p-2 text-white">
        <Link href="/admin/coupons/add">اضافه کردن کد تخفیف</Link>
      </div>
    </div>
  );
};
export default Coupons;
