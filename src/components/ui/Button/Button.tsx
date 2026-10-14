import { ComponentProps } from 'react';

import clsx from 'clsx';

type ButtonStyle = 'primary' | 'outline';
type Size = 'md' | 'lg';

type ButtonProps = ComponentProps<'button'> & {
  variant: ButtonStyle;
  size: Size;
};

const btn: Record<ButtonStyle, string> = {
  primary: 'bg-black text-white',
  outline: 'border bg-transparent text-black',
};

const btnSize: Record<Size, string> = {
  md: 'py-3 px-22.75 rounded-md',
  lg: 'py-4 px-32.5 rounded-lg',
};

const Button = ({
  children,
  type,
  className,
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(className, btn[variant], btnSize[size])}
      {...rest}
    >
      {children}
    </button>
  );
};
export default Button;
