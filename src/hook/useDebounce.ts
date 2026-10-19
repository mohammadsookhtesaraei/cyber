import { useEffect, useState } from 'react';

export const useDebounceValue = <T>(
  data: T,
  delay: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(data);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [data, delay]);

  return [value, setValue];
};
