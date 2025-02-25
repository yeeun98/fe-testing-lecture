import { screen, within } from '@testing-library/react';
import React from 'react';

import data from '@/__mocks__/response/products.json';
import ProductList from '@/pages/home/components/ProductList';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

const PRODUCT_PAGE_LIMIT = 5;

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      state: {
        prevPath: 'prevPath',
      },
    }),
  };
});

it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />)

  // const productCards = screen.getAllByTestId('product-card'); // error -> 비동기로 동작하기 때문
  // findBy~~ : 일정시간(1초 동안 50ms마다)동안 요소가 있는지 조회한 후에 다음 테스트 코드를 실행
  const productCards = screen.findAllByTestId('product-card');

  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  productCards.forEach((el, index) => {
    const productCard = within(el);
    const product = data.products[index];

    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(productCard.getByText(formatPrice(product.price))).toBeInTheDocument();
  });
});

it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />)

  // show more 버튼의 노출 여부를 정확하게 판단하기 위해
  // findBy 쿼리를 사용하여 먼저 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야 함.
  await screen.findAllByTestId('product-card');

  expect(screen.getByRole('button', {name: 'Show more'})).toBeInTheDocument();

  const moreBtn = screen.getByRole('button', { name: 'Show more' });
  await user.click(moreBtn);

  expect(await screen.findAllByTestId('product-card')).toHaveLength(PRODUCT_PAGE_LIMIT * 2);
});

it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // 모킹 데이터 크기인 20개보다 많은 수 50으로 limit를 설정
  await render(<ProductList limit={50} />);

  await screen.findAllByTestId('product-card');

  expect(screen.queryByText('Show more')).not.toBeInTheDocument();
});

describe('로그인 상태일 경우', () => {
  beforeEach(() => {
    mockUseUserStore({ isLogin: true, user: { id: 10 } });
  });

  it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(
      1,
      data.products[productIndex],
      10,
      1,
    );
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
  });

  it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    const product = data.products[productIndex];
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
    expect(
      screen.getByText(`${product.title} 장바구니 추가 완료!`),
    ).toBeInTheDocument();
  });
});

describe('로그인이 되어 있지 않은 경우', () => {
  it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });

  it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });
});

it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  const [firstProduct] = await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  await user.click(firstProduct);

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/6');
});
