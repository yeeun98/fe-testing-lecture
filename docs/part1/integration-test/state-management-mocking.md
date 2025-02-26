## ✅ 상태 관리와 통합 테스트 (Zustand 기반)

> 이 문서는 `Zustand`를 활용한 상태 관리와 통합 테스트 작성 방법을 정리한 내용입니다.  
> 통합 테스트에서는 앱의 상태를 원하는 대로 제어하기 위해 상태 모킹이 필요합니다.

---

### 📦 상태 관리 모킹의 필요성
- **큰 범위의 통합 테스트**에서는 모킹해야 할 정보가 많아져서 유지보수가 어려워질 수 있습니다.
- 상태 관리 라이브러리인 `Zustand`를 활용하면 **컴포넌트의 상태를 유연하게 제어**할 수 있습니다.

### ✅ 테스트 전략
- **비즈니스 로직이 포함된 컴포넌트**(`ProductInfoTable`, `PriceSummary`)는 통합 테스트 작성
- **단순 UI 렌더링 컴포넌트**(`PageTitle`, `Divider`)는 별도의 테스트 작성 X

---

### 💻 예제 코드

#### 1️⃣ 초기 상태 모킹
테스트 실행 전, 필요한 상태를 설정하기 위해 `mockUseCartStore`와 `mockUseUserStore`를 사용합니다.

```javascript
import { mockUseCartStore, mockUseUserStore } from '@/utils/test/mockZustandStore';

beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: { id: 6, title: 'Handmade Cotton Fish', count: 3, price: 809 },
      7: { id: 7, title: 'Awesome Concrete Shirt', count: 4, price: 442 }
    },
  });
});
```
- mockUseUserStore: 사용자 정보 초기화
- mockUseCartStore: 장바구니에 초기 상품 정보 설정

----

#### 2️⃣ 장바구니 아이템 렌더링 테스트

```jsx
it('장바구니에 포함된 아이템들이 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);
  const [firstItem, secondItem] = screen.getAllByRole('row');

  // 요소가 실제로 DOM에 존재하는지 검증
  expect(within(firstItem).getByText('Handmade Cotton Fish')).toBeInTheDocument(); // ✅ 요소 존재 여부 확인

  // 입력 필드의 값이 올바른지 검증
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3'); // ✅ 텍스트박스의 초기 값 검증

  expect(within(secondItem).getByText('Awesome Concrete Shirt')).toBeInTheDocument(); // ✅ 요소 존재 여부 확인
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4'); // ✅ 텍스트박스 값 검증
});
```

---

#### 3️⃣ 수량 변경 및 가격 업데이트 테스트
```jsx
it('수량이 변경되면 가격이 올바르게 업데이트된다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');
  await user.clear(input); // ✅ 기존 수량 초기화
  await user.type(input, '5'); // ✅ 새로운 수량 입력

  // 변경된 수량에 따라 총합 가격이 업데이트 되었는지 확인
  expect(screen.getByText('$4,045.00')).toBeInTheDocument(); // ✅ 업데이트된 가격이 렌더링 되었는지 검증
});
```

----

#### 4️⃣ 최대 수량 제한 테스트
```jsx
it('수량이 1000개로 변경되면 경고 메시지가 표시된다', async () => {
  const alertSpy = vi.fn(); // ✅ alert 함수 호출을 감지하기 위한 Spy 함수 생성
  vi.stubGlobal('alert', alertSpy); // ✅ window.alert를 mock 함수로 대체

  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '1000'); // ✅ 최대 수량(1000개) 입력

  // alert 함수가 호출되었는지 검증
  expect(alertSpy).toHaveBeenCalledWith('최대 999개 까지 가능합니다!'); // ✅ 경고 메시지가 올바르게 표시되는지 확인
});
```

---

#### 5️⃣ 아이템 삭제 테스트
```jsx
it('삭제 버튼 클릭 시 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');
  const deleteButton = within(secondItem).getByRole('button');

  // 삭제 전, 아이템이 존재하는지 검증
  expect(within(secondItem).getByText('Awesome Concrete Shirt')).toBeInTheDocument(); // ✅ 삭제 전 DOM에 존재 여부 확인

  await user.click(deleteButton); // ✅ 삭제 버튼 클릭

  // 삭제 후, 아이템이 더 이상 존재하지 않는지 검증
  expect(within(secondItem).queryByText('Awesome Concrete Shirt')).not.toBeInTheDocument(); // ✅ 요소가 DOM에서 사라졌는지 확인
});
```

---

### 🚨 테스트 시 유의 사항
1. **모킹 최소화**: *가능한 실제 비즈니스 로직과 유사한 흐름으로 테스트하여 신뢰성 유지*
2. **테스트 독립성 유지**: *각 테스트 후 상태 초기화를 위해 afterEach에서 store를 리셋해야 합니다.*
```jsx
afterEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn())); // ✅ 각 테스트 후 상태 초기화
});
```
