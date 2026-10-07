import { ComponentProps, ReactElement } from 'react';

type RadioInputProps = ComponentProps<'input'> & {
  label: string;
  error?: string | null;
};

const RadioInput = ({}: RadioInputProps): ReactElement => {
  return <div className="">Hello from RadioInput</div>;
};

export default RadioInput;
