## 🧪 RTL 비동기 유틸 함수를 활용한 노출 테스트 작성

이 테스트는 `ProductList` 컴포넌트를 대상으로, **비동기 동작**과 **상태 변화**에 따른 UI 렌더링을 검증합니다.  
React Testing Library의 비동기 쿼리(`findBy`, `queryBy`)와 유저 이벤트(`user.click`)를 활용하여 정확한 테스트를 작성했습니다.

<br/>

## ✔️ 비동기 동작 처리

비동기 테스트에서는 **렌더링이 완료된 시점**을 기다려야 올바른 결과를 검증할 수 있습니다.  
React Testing Library는 이를 위해 `findBy*` 메서드를 제공합니다:

- **`findBy*`**: 비동기로 동작하는 요소를 기다린 후 반환. (기본 타임아웃: 1초)<br/>
    -> API 호출과 같은 비동기 처리로 인한 변화를 감지해야 할 때 사용<br/>
    -> RTL에서는 findBy같은 비동기 메서드의 반환값은 Promise이기에, 해당 요소를 사용하려면 await이나 then을 사용해야한다.
- **`queryBy*`**: 비동기로 요소를 찾되, 존재하지 않을 때 `null` 반환. (실패하지 않음)
- **`getBy*`**: 즉시 요소를 반환하나, 비동기로 동작하는 경우 실패 가능.

<br/>

## ✔️ 예제 코드

### 1️⃣ 상품 리스트가 제대로 노출되는지 확인

- 상품 리스트가 로딩된 후, 화면에 **정확한 개수의 상품 카드가 렌더링**되는지 확인.
- 비동기로 동작하므로 `findAllByTestId`를 사용해 상품 리스트 렌더링이 완료될 때까지 기다림.

```javascript
it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // 상품 리스트가 렌더링 완료될 때까지 기다림
  const productCards = await screen.findAllByTestId('product-card');

  // 지정된 limit만큼 렌더링되었는지 확인
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  // 상품 카드의 각 정보를 검증
  productCards.forEach((el, index) => {
    const productCard = within(el); // 개별 상품 카드 컨테이너에 접근
    const product = data.products[index];

    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(productCard.getByText(formatPrice(product.price))).toBeInTheDocument();
  });
});
```

### 2️⃣ 더 많은 상품 리스트를 가져오는 버튼 동작 확인
- “Show more” 버튼이 보이는 경우, 클릭 시 추가 상품 리스트가 렌더링되는지 확인.
- 첫 페이지의 상품 목록 렌더링이 완료된 후, 버튼 동작 검증.

```javascript
it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // 첫 번째 페이지 상품 리스트 렌더링을 기다림
  await screen.findAllByTestId('product-card');

  // "Show more" 버튼이 존재하는지 확인
  expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();

  // 버튼 클릭 시 추가 상품 리스트 로드
  const moreBtn = screen.getByRole('button', { name: 'Show more' });
  await user.click(moreBtn);

  // 총 상품 리스트 개수 확인 (2페이지 데이터)
  expect(await screen.findAllByTestId('product-card')).toHaveLength(PRODUCT_PAGE_LIMIT * 2);
});
```

### 3️⃣ 더 보여줄 상품 리스트가 없는 경우 버튼이 사라지는지 확인
- limit 값이 모킹 데이터 개수보다 큰 경우, “Show more” 버튼이 노출되지 않아야 함.
- `queryByText`를 사용해 버튼이 존재하지 않음을 확인.

```javascript
it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // limit 값을 모킹 데이터 크기보다 크게 설정
  await render(<ProductList limit={50} />);

  // 상품 리스트 렌더링 완료를 기다림
  await screen.findAllByTestId('product-card');

  // "Show more" 버튼이 없어야 함
  expect(screen.queryByText('Show more')).not.toBeInTheDocument();
});
```

<br/>

---

<br/>

## ✔️ 주요 개념 요약

#### 비동기 쿼리 사용
	1.	findBy*:
	- 일정 시간(기본 1초) 동안 DOM 요소를 찾음.
    - 요소가 로드될 때까지 기다려야 하는 테스트에 사용.
	예) screen.findAllByTestId('product-card').

	2.	queryBy*:
	- 요소를 찾되, 존재하지 않을 경우 null을 반환.
	- DOM에 없어야 하는 요소를 검증할 때 유용.
	- 예) screen.queryByText('Show more').

	3.	getBy*:
	- DOM에서 즉시 요소를 찾음. (비동기 요소에는 실패 가능)

<br/>

## 테스트의 핵심 포인트
	•	비동기 상태를 기다릴 때 findBy* 사용:
	•	로딩이 완료될 때까지 기다린 후 테스트를 실행.
	•	요소가 없는 경우 queryBy*로 검증:
	•	버튼이나 요소가 DOM에 없는지 확인.