'use client';

import { PropsWithChildren, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

type Props = PropsWithChildren;

export const ReactQueryProvider = ({ children }: Props): ReactNode => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
