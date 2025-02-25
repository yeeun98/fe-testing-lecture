import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

// https://tanstack.com/query/v4/docs/react/guides/testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
  },
});

export default async (component, options = {}) => {
  const { routerProps } = options;
// userEvent :: 클릭 키보드 이벤트등 다양한 사용자의 이벤트를 시뮬레이션 할 수 있게하는 라이브러리
  // setup이라는 함수를 통해 반환받은 인스턴스를 통해 api를 사용할 수 있음
  const user = userEvent.setup();

  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{component}</MemoryRouter>
        <Toaster />
      </QueryClientProvider>,
    ),
  };
};
