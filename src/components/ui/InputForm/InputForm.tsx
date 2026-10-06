import { ComponentProps, ReactElement, useId } from 'react';

import clsx from 'clsx';

type InputFormProps = ComponentProps<'input'> & {
  label: string;
  error?: string | null;
};

const InputForm = ({
  label,
  error,
  dir,
  ...rest
}: InputFormProps): ReactElement => {
  const id = useId();
  return (
    <div className="relative my-2">
      <label className="text-muted mb-2 block text-sm" htmlFor={id}>
        {label}
        <span className="text-red-500">*</span>
      </label>
      <input
        {...rest}
        dir={dir}
        className={clsx(
          error
            ? 'bg-surface h-12 w-full rounded-xl border border-rose-400 px-3.5 text-rose-400 focus:outline-none'
            : 'bg-surface border-border focus:shadow-surface text-primary h-12 w-full rounded-xl border px-3.5 focus:shadow-md focus:outline-none'
        )}

        id={id}
        type="text"

        autoComplete="off"
      />
      <span
        className={clsx(
          'absolute top-21 right-0 bottom-0 w-full translate-y-1/2',
          error && 'text-sm text-rose-400'
        )}
      >
        {error}
      </span>
    </div>
  );
};

export default InputForm;
