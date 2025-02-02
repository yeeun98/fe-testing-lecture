### 상태 관리와 통합 테스트
> 예제에서는 [zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)를 사용하여 앱의 상태를 관리한다.
> 원하는 상태로 통합 테스트를 하기 위해선 zustand 모킹 필요 !

---

#### 💻 예제 코드
```jsx
const CartTable = () => {
  return (
    <>
      <PageTitle />
      <ProductInfoTable />
      <Divider sx={{ padding: 2 }} />
      <PriceSummary />
    </>
  );
};
```
- `CartTable` 컴포넌트를 통합테스트 작성하면, 큰 범위의 통합 테스트는 모킹해야하는 정보가 많아지며 변경에도 깨지기 쉬움
- `ProductInfoTable`, `PriceSummary`로 나누어 통합 테스트 작성
    -> 장바구니 state를 사용하여 데이터를 렌더링
- `PageTitle`, `Divider` 컴포넌트는 단순한 UI 렌더링
    -> 테스트 작성 X

----

#### 🚨 유의 사항
> **앱의 전역 상태를 모킹해 테스트 전·후에 값을 변경하고 초기화해야 한다**

- `__mocks__/zustand.js`를 통해 자동 모킹을 적용해 스토어를 초기화하자
```js
// 테스트가 구동되기 전 모든 스토어를 리셋합니다.
// 테스트의 독립성 유지
afterEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()));
});
```
- `mockZustandStore`의 유틸 함수를 통한 zustand 스토어의 상태 변경
```jsx
const mockStore = (hook, state) => {
  const initStore = hook.getState();
  hook.setState({ ...initStore, ...state }, true);
};

export const mockUseUserStore = state => {
  mockStore(useUserStore, state);
};

export const mockUseCartStore = state => {
  mockStore(useCartStore, state);
};

export const mockUseFilterStore = state => {
  mockStore(useFilterStore, state);
};
```

---

📌 다른 상태 관리 라이브러리도 모킹 가이드를 제공하니 사용하는 라이브러리의 가이드를 참고하자.