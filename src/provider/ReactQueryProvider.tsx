'use client';

import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Props = PropsWithChildren;

export const ReactQueryProvider = ({ children }: Props): void => {
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
