# 테스트 더블 (Test Doubles)

테스트 더블은 테스트를 진행할 때 실제 모듈을 대체하여 사용하는 다양한 객체를 의미합니다.  
이를 통해 외부 의존성을 제거하고, 특정 상황을 제어하거나 예상한 동작을 검증할 수 있습니다.

테스트 더블은 아래 5가지 유형으로 구분됩니다

---

## 1. 더미 (Dummy)
> **"아무런 동작을 하지 않는 가짜 객체"**

- 해당 모듈이 필요하지만 **실제 기능은 불필요**할 때 사용합니다.
- 보통은 **함수 인자**에만 필요하고, 호출 자체가 목적이 아닙니다.

💡 **예시:** (동작은 필요 없지만, 함수가 특정 인자를 요구할 때)
```js
const dummyFunction = (param1, param2) => {};
dummyFunction('dummyValue1', 'dummyValue2'); // 더미 값만 전달
```

---

## 2. 스텁 (Stub)
> **"정해진 값을 반환하는 더미의 고도화 버전"**

- 호출되었을 때 **고정된 값을 반환**하도록 미리 정의합니다.
- 외부 API 호출이나 복잡한 로직을 단순화하기에 유용합니다.

💡 **예시:** (Vue 테스트에서 API 응답을 미리 정의)
```jsx
/** setupTests.js **/
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## 3. 스파이 (Spy)
> **"호출 기록을 남기는 스텁"**

- 호출 여부, 호출 횟수, 전달된 매개변수를 기록합니다.
- 주로 특정 로직이 실행되었는지 검증할 때 사용합니다.

💡 **예시:** (함수 호출 여부를 추적)
```js
/** NavigationBar.spec.jsx **/
const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    // 스파이 함수를 통해 페이지 이동에 필요한 값이 올바르게 전달되었는지 검증
    useNavigate: () => navigateFn,
    // 고정된 값을 넘겨주는 스텁 함수로 대체
    useLocation: () => ({
      pathname: 'pathname',
    }),
  };
});

/** Forms.spec.jsx **/
describe('로그인이 성공한 경우', () => {
  it('전달된 access_token을 쿠키에 저장하는 메서드를 호출한다', async () => {
    const { user } = await render(<Forms />);
    const submitButton = screen.getByRole('button');
    
    // 기존 모듈의 구현을 스파이로 만들어 기록 (Cookies.set 함수가 호출되었을 때 기록)
    vi.spyOn(Cookies, 'set');
    ...
  })
});
```

---

## 4. 목 (Mock)
> **"실제 모듈과 유사한 동작을 흉내내는 객체"**

- 특정 기능을 완전히 모방하여, **행동 기반**으로 검증합니다.
- 단순히 고정된 값만 반환하는 것이 아니라, 특정 조건에 맞는 동작을 수행하도록 구현합니다.

💡 **예시:** (Vue에서 `useNavigate`와 `useLocation` 모킹)
```jsx
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    // 스파이 함수를 통해 페이지 이동에 필요한 값이 올바르게 전달되었는지 검증
    useNavigate: () => navigateFn,
    // 고정된 값을 넘겨주는 스텁 함수로 대체
    useLocation: () => ({ pathname: 'pathname' }),
  };
});
```

---

## 5. 페이크 (Fake)
> **"간단한 로직을 실제로 구현한 가짜 객체"**

- 스텁과 비슷하지만, 단순한 로직을 포함해 특정 상황을 시뮬레이션할 수 있습니다.
- 복잡한 의존성을 배제하고 독립적으로 테스트를 진행할 수 있습니다.

💡 **예시:** (장바구니 기능을 위한 Fake Store)
```jsx
beforeEach(() => {
  const cart = {
    6: { id: 6, title: 'Handmade Cotton Fish', price: 100, count: 3 },
    7: { id: 7, title: 'Awesome Concrete Shirt', price: 50, count: 4 },
  };

  mockUseCartStore({ cart });
});
```

---

## 🚨 **요약**
| 유형  | 특징                      | 용도                 |
|:-------|:------------------------|:---------------------|
| **더미** | 동작 없이 호출만 필요할 경우  | 단순 값 전달             |
| **스텁** | 특정 값만 반환하도록 정의  | API 응답, 데이터 반환      |
| **스파이** | 호출 여부, 횟수 추적      | 로직 실행 검증             |
| **목**   | 실제 모듈과 유사하게 구현   | 특정 조건 만족 여부 확인      |
| **페이크** | 단순한 로직을 구현한 가짜   | 복잡한 의존성 제거 및 로직 테스트 |

