# 🧪 React Hooks 단위 테스트 with Vitest

## 📌 리액트 훅 테스트란?
> **리액트 훅(Hooks)**은 반드시 **리액트 컴포넌트 내부에서만 호출**되어야 하지만,  
> `@testing-library/react`의 `renderHook()`을 사용하면 **컴포넌트 없이도 훅을 독립적으로 테스트**할 수 있다.

✅ **훅을 테스트하는 이유**
- 특정 상태값(state)이 올바르게 변경되는지 확인
- 훅의 내부 로직이 의도한 대로 동작하는지 검증
- `useState`, `useEffect` 같은 내장 훅이나 **커스텀 훅**을 테스트 가능

✅ **Vitest + React Testing Library를 사용하여 훅을 테스트하는 주요 함수**
- `renderHook()` : **컴포넌트 없이도 리액트 훅을 실행하고 상태를 추적**할 수 있음
- `act()` : **상태 업데이트가 포함된 코드 블록을 감싸서 실행**, 동기적으로 테스트 가능

---

## 📌 예제 코드: `useConfirmModal` 훅 테스트
```tsx
// useConfirmModal.tsx
import { useState } from 'react';

const useConfirmModal = (initialValue = false) => {
  const [isModalOpened, setIsModalOpened] = useState(initialValue);

  const toggleIsModalOpened = () => {
    setIsModalOpened(!isModalOpened);
  };

  return {
    toggleIsModalOpened,
    isModalOpened,
  };
};

export default useConfirmModal;
```

```tsx
// useConfirmModal.spec.js
import { renderHook, act } from '@testing-library/react';

import useConfirmModal from './useConfirmModal';

// ✅ 1. 초기 상태 테스트 (isModalOpened 기본값이 false인지 확인)
it('호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.', () => {
    // result : 훅이 반환한 값을 저장 (최신 상태 추적 가능)
    // rerender : 인자를 변경하여 훅을 다시 호출 (상태 갱신 가능)
    const { result, rerender } = renderHook(useConfirmModal);

    expect(result.current.isModalOpened).toBe(false);
});

// ✅ 2. 초기값을 특정 boolean 값으로 전달하면 해당 값으로 상태가 설정되는지 테스트
it('호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.', () => {
    const { result } = renderHook(() => useConfirmModal(true));

    expect(result.current.isModalOpened).toBe(true);
});

// ✅ 3. toggleIsModalOpened() 호출 시 상태가 변경되는지 테스트
it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {
    const { result } = renderHook(useConfirmModal);

    act(() => {
        result.current.toggleIsModalOpened();
    });

    expect(result.current.isModalOpened).toBe(true);
});
```

---

## 📌 renderHook() 함수란?
> renderHook()은 리액트 컴포넌트 없이 훅을 실행하고, 해당 훅이 반환하는 값을 직접 접근할 수 있도록 해주는 함수.

### ✅ `renderHook()`의 반환 값

| 속성               | 설명                                               |
|--------------------|--------------------------------------------------|
| `result.current`  | 훅이 반환한 값 (최신 상태 유지)                    |
| `rerender(newProps)` | 새로운 인자를 전달하여 훅을 다시 호출 (상태 갱신) |

### ✅ `renderHook()` 예제
```tsx
const { result, rerender } = renderHook(useConfirmModal);

console.log(result.current.isModalOpened); // false
rerender(true); // 훅을 다시 호출하면서 새로운 initialValue 전달
console.log(result.current.isModalOpened); // true
```

🚀 renderHook()을 사용하면 리액트 훅을 독립적으로 실행하고 상태를 추적할 수 있음.

---

## 📌 act() 함수란?
> act()는 상태 업데이트가 발생하는 코드 블록을 감싸서 실행하는 함수
> React의 상태 변경이 즉시 반영되도록 보장하여 테스트의 일관성을 유지하는 역할을 한다.

### ✅ 예제 1: `act()` 없이 실행했을 때 => 문제 발생
```tsx
const { result } = renderHook(useConfirmModal);

act(() => {
    result.current.toggleIsModalOpened();
});

expect(result.current.isModalOpened).toBe(true);
```
**🚨 이 코드의 문제점**
•	toggleIsModalOpened()을 호출했지만, 상태 변경이 즉시 반영되지 않을 수 있음.
•	테스트 실행 시점에서 React의 상태 업데이트가 완료되지 않았을 가능성이 있음.

### ✅ 예제 2: `act()`로 실행했을 때
```tsx
it('toggleIsModalOpened() 호출 시 상태 변경', () => {
    const { result } = renderHook(useConfirmModal);

    // ❌ act() 없이 상태 변경 (잘못된 예제)
    result.current.toggleIsModalOpened();

    // ❌ 예상했던 값과 다를 수 있음 (비동기적으로 처리되기 때문)
    expect(result.current.isModalOpened).toBe(true); // 오류 발생 가능
});
```

🚀 act()를 사용하면 리액트의 상태 변경을 동기적으로 실행할 수 있어 테스트가 안정적으로 동작함.

---

## 🎯 정리
- ✅ renderHook()을 사용하면 리액트 컴포넌트 없이도 훅을 독립적으로 실행 & 테스트 가능
- ✅ result.current를 사용해 훅이 반환하는 최신 상태를 추적 가능
- ✅ act()를 사용하여 상태 변경을 동기적으로 실행하여 테스트 안정성 확보