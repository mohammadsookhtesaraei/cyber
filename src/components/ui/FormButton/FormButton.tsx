import { ReactElement, ReactNode } from 'react';

type FormButtonProps = {
  children: ReactNode;
};

const FormButton = ({ children }: FormButtonProps): ReactElement => {
  return (
    <button className="bg-primary disabled:bg-muted/30 text-bg-muted mt-8 flex w-full cursor-pointer items-center justify-center rounded-xl py-3">
      {children}
    </button>
  );
};

export default FormButton;
