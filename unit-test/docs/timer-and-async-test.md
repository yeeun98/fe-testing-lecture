## 🧪 타이머 테스트로 배우는 비동기 테스트
> 비동기 타이머가 포함된 함수의 테스트
> 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행되기 때문에,  
> 비동기 함수가 실행되기 전에 단언(`expect`)이 실행되어 테스트가 실패할 수 있음  
> → 이를 해결하기 위해 타이머 모킹(Mock Timers)을 활용한다.

---

### **📌 타이머를 사용하는 함수 테스트의 문제점**
- `setTimeout`, `setInterval` 같은 비동기 타이머 함수는 지정된 시간이 지나야 실행됨.
- 하지만 테스트 코드는 동기적으로 실행되므로, 테스트가 완료되기 전에 단언이 실행되어 실패할 수 있음.
- 해결책: `vi.useFakeTimers()`을 사용하여 테스트 환경에서 시간을 제어할 수 있도록 설정.

---

### **👩🏻‍💻 예제 1: 특정 시간이 지난 후 함수가 호출되는지 테스트**
> debounce 함수 테스트
> - `debounce()`는 특정 시간이 지나야 함수가 실행되도록 제한하는 함수.  
> - 즉, 연이어 호출해도 마지막 호출 후 일정 시간이 지나야 함수가 실행됨.

```tsx
// common.js > debounce()
/**
 * 연이어 호출해도 마지막 호출 기준으로 지정된 시간이 지나야만 콜백 함수 실행
 * → 특정 함수의 호출 횟수를 제한하는 기능
 */
export const debounce = (fn, wait) => {
  let timeout = null;

  return (...args) => {
    const later = () => {
      timeout = -1;
      fn(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
};
```

**📝 테스트 코드**
```tsx
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { debounce } from './common';

describe('debounce 함수 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // 타이머 모킹 활성화
  });

  afterEach(() => {
    vi.useRealTimers(); // 타이머 초기화 (다른 테스트에 영향 방지)
  });

  it('특정 시간이 지난 후 함수가 호출된다.', () => {
    const spy = vi.fn(); // 함수 호출 여부를 감시하는 Mock Function
    const debouncedFn = debounce(spy, 300);

    debouncedFn();

    // ❌ spy 함수가 즉시 실행되지 않음 → expect(spy).toHaveBeenCalled(); 실패
    // 🔹 해결: 타이머를 조작하여 시간 흐름을 제어
    vi.advanceTimersByTime(300); // 300ms 흐른 것처럼 조작

    expect(spy).toHaveBeenCalled(); // ✅ 정상 실행
  });
});
```

### 👩🏻‍💻 예제 2: 여러 번 호출해도 마지막 호출 후에만 실행되는지 테스트
> 연속해서 debounce 함수를 호출해도 마지막 호출 기준으로 실행되는지 검증

**📝 테스트 코드**
```tsx
it('연이어 호출해도 마지막 호출 기준으로 지정된 시간이 지난 경우에만 함수가 호출된다.', () => {
  const spy = vi.fn();
  const debouncedFn = debounce(spy, 300);

  // 1️⃣ 최초 호출 후 0.2초 후 다시 호출
  vi.advanceTimersByTime(200);
  debouncedFn();

  // 2️⃣ 두 번째 호출 후 0.1초 후 다시 호출
  vi.advanceTimersByTime(100);
  debouncedFn();

  // 3️⃣ 세 번째 호출 후 0.2초 후 다시 호출
  vi.advanceTimersByTime(200);
  debouncedFn();

  // 4️⃣ 네 번째 호출 후 0.3초 후 호출
  vi.advanceTimersByTime(300);
  debouncedFn();

  // 🔹 총 5번 호출했지만, debounce는 마지막 호출 기준으로 실행되므로 실제 함수는 단 1번만 실행되어야 함.
  expect(spy).toHaveBeenCalledTimes(1);
});
```

✅ debounce가 정상적으로 동작하여, 마지막 호출 후 300ms가 지나야 실행됨을 검증.

---

### 📌 Mock Timer 관련 함수 정리

| 함수명 | 설명 |
|------|--------------------------------------------------|
| **`vi.useFakeTimers()`** | 테스트 환경에서 **가짜 타이머(fake timer)를 활성화** |
| **`vi.useRealTimers()`** | 테스트 후 **타이머를 원래 상태로 복구** |
| **`vi.advanceTimersByTime(ms)`** | `ms` 만큼 시간이 흐른 것처럼 시뮬레이션 |
| **`vi.setSystemTime(date)`** | 특정 시점으로 **시스템 시간을 고정** (일관된 테스트 가능) |

**1️⃣ `vi.useFakeTimers()`**
> 가짜 타이머(fake timers)를 활성화하여, 실제 시간이 흐르지 않아도 타이머를 테스트할 수 있도록 함.
```tsx
beforeEach(() => {
  vi.useFakeTimers(); // 가짜 타이머 사용
});
```
✅ setTimeout, setInterval 같은 타이머 함수가 실제 실행되지 않고, 우리가 원하는 대로 시간을 조작할 수 있음.

**2️⃣ `vi.useRealTimers()`**
> 테스트에서 useFakeTimers()를 사용한 후, 실제 타이머로 복원할 때 사용.
```tsx
afterEach(() => {
  vi.useRealTimers(); // 원래 타이머로 복구 (다른 테스트에 영향 방지)
});
```
✅ 타이머를 원래 상태로 돌려서, 다른 테스트에 영향을 주지 않도록 함.

**3️⃣ `vi.advanceTimersByTime(ms)`**
> 특정 시간이 흐른 것처럼 시뮬레이션할 때 사용.
```tsx
vi.advanceTimersByTime(300); // 300ms 후에 실행될 함수를 즉시 실행
```
✅ 테스트 코드에서 “300ms 후 실행될 함수”를 기다리지 않고 바로 실행 가능!

**4️⃣ `vi.setSystemTime(date)`**
> 테스트에서 시간을 고정하여 실행 환경에 따라 테스트 결과가 달라지지 않도록 하는 함수.
```tsx
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-12-25')); // 시스템 시간을 2023년 12월 25일로 고정
});
```
✅ 현재 시간을 기준으로 동작하는 코드(new Date() 등)가 테스트 환경에 따라 달라지는 것을 방지할 수 있음!

---

### 🎯 최종 정리
- ✅ 비동기 타이머 테스트에서는 vi.useFakeTimers()를 사용하여 테스트 타이머를 제어해야 함.
- ✅ 타이머가 포함된 함수(debounce)는 실제 시간이 지나야 실행되므로, vi.advanceTimersByTime(ms)를 활용해 시간을 조작해야 함.
- ✅ 테스트 간의 독립성을 유지하기 위해 vi.useRealTimers()를 사용하여 타이머를 초기화하는 것이 중요.

