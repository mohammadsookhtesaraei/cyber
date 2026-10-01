import { ReactElement } from 'react';

import InputForm from '@/components/ui/InputForm/InputForm';

const CheckProfile = (): ReactElement => {
  return (
    <div className="py-24 lg:py-32">
      <div className="wrapper">
        <div className="flex w-full justify-center">
          <form className="border-border bg-bg w-full max-w-100 rounded-[20px] border p-6">
            <InputForm
              dir="ltr"
              label="شماره موبایل"
              placeholder="09111254645"
            />
            <InputForm
              dir="rtl"
              label="نام نام خانوادگی"
              placeholder="نام خانوادگی"
            />
            <InputForm dir="ltr" type="email" label="ایمیل" />
            <button
              // disabled={isPending}
              className="bg-primary disabled:bg-muted/30 text-bg-muted mt-8 w-full cursor-pointer rounded-xl py-3 disabled:cursor-not-allowed"
            >
              ارسال
              {/* {isPending ? 'درحال ارسال...' : 'کد تایید'} */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CheckProfile;
