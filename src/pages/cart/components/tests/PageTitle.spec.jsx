import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import render from '@/utils/test/render';

// 테스트 파일 내에 스냄샷까지 함께 관리하고 싶은 경우
it('pageTitle 스냅샷 테스트(toMatchInlineSnapshot)', async () => {
  const { container } = await render(<PageTitle />);

  expect(container).toMatchInlineSnapshot();
});

// 테스트 파일과 스냅샷 파일을 별도로 관리하고 싶은 경우
it('pageTitle 스냅샷 테스트(toMatchSnapshot)', async () => {
  const { container } = await render(<PageTitle />);

  expect.toMatchSnapshot();
});
