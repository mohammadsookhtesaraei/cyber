import { ReactElement } from 'react';

import clsx from 'clsx';

type ActionsButtonProps = {
  step: number;
};

const ActionsButton = ({ step }: ActionsButtonProps): ReactElement => {
  return (
    <div className="bg-bg-muted mb-6 grid grid-cols-2 rounded-xl p-1">
      <button
        className={clsx(
          'cursor-pointer rounded-[9px] p-2.5 text-sm transition-all duration-300',
          step === 1 ? 'text-primary bg-bg' : 'text-secondary'
        )}
      >
        ورود/ثبت نام
      </button>
      <button
        className={clsx(
          'cursor-pointer rounded-[9px] p-2.5 text-sm transition-all duration-300',
          step === 2 ? 'text-primary bg-bg' : 'text-secondary'
        )}
      >
        احراز هویت
      </button>
    </div>
  );
};
export default ActionsButton;
