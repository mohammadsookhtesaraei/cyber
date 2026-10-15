import Image from 'next/image';

import { ReactElement } from 'react';

import FooterLogo from '@/assets/images/footerLogo.webp';

const Footer = (): ReactElement => {
  const date = new Date().getFullYear();
  return (
    <footer className="bg-[#000000] py-26">
      <div className="contentWrapper">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="order-3 md:order-1">
            <h2 className="mb-2 text-[16px] font-semibold text-white">
              پشتیبانی مشتری
            </h2>
            <ul className="flex flex-col gap-2 text-[14px] font-light text-[#CFCFCF]">
              <li>پیگیری سفارش</li>
              <li>تعویض و مرجوعی کالا</li>
              <li>گارانتی (یا ضمانت)</li>
              <li>سوالات متداول</li>
              <li>قوانین</li>
            </ul>
          </div>

          <div className="order-2">
            <h2 className="mb-2 text-[16px] font-semibold text-white">خدمات</h2>
            <ul className="flex flex-col gap-2 text-[14px] font-light text-[#CFCFCF]">
              <li>باشگاه مشتریان</li>
              <li>کارت‌های هدیه</li>
              <li>اعتبار و پرداخت</li>
              <li>قراردادهای خدمات</li>
              <li>حساب غیرنقدی</li>
              <li>پرداخت</li>
            </ul>
          </div>

          <div className="order-1 flex flex-col items-center sm:items-end md:order-3">
            <div>
              <Image
                className="h-7 w-23.75 shrink-0"
                src={FooterLogo}
                width={95}
                height={28}
                alt="FooterLogo"
                quality={100}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-[#CFCFCF] md:text-start">
          <p>تمامی حقوق متعلق به فروشگاه سایبر می باشد.&copy;{date}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
