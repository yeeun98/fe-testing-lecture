## 🧪 모킹(Mocking)이란?
> 실제 모듈·객체와 동일한 동작을 하도록 만든 **모의(Mock) 모듈·객체**를 사용하여, 실제 코드와 독립적으로 테스트할 수 있도록 하는 기법.

### ✅ **Mocking이 필요한 이유**
- 외부 라이브러리나 API에 의존하지 않고 **독립적인 테스트 환경을 구축**할 수 있음.
- 네트워크 요청, 브라우저 이벤트 같은 **실제 동작을 수행하지 않고 테스트 가능**.
- **부작용(side-effect)** 없이 함수 호출 여부 및 인수를 검증할 수 있음.

---

## 📌 **`useNavigate` 모킹(Mock) 테스트**

### **🚀 목표**
- `useNavigate`를 모킹하여, 특정 경로로 **올바르게 이동하는지** 테스트.
- 실제 네비게이션이 발생하지 않도록 **`jest.fn()` 또는 `vi.fn()`을 사용**해 `navigate` 함수를 대체.

### **💻 예제 코드**
### **1️⃣ `EmptyNotice.jsx` (테스트 대상 컴포넌트)**
```javascript
import { Typography, Box, Link as MuiLink } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';

const EmptyNotice = () => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(pageRoutes.main);
  };

  return (
    ...
      <Typography sx={{ fontSize: '50px', fontWeight: 'light' }}>
        텅~
      </Typography>
      <MuiLink
        underline="hover"
        onClick={handleClickBack}
        style={{ cursor: 'pointer' }}
        role="link"
      >
        홈으로 가기
      </MuiLink>
    ...
  );
};

export default EmptyNotice;
```

### **2️⃣ EmptyNotice.spec.jsx (테스트 코드)**
```javascript
import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

// 🛠️ 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행
// useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되었는가 -> 스파이 함수(Mock Function)
const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');
    return { ...original, useNavigate: () => navigateFn };
});

it('"홈으로 가기" 링크를 클릭할 경우 "/" 경로로 navigate 함수가 호출된다', async () => {
    const { user } = await render(<EmptyNotice />);

    await user.click(screen.getByText('홈으로 가기'));

    // ✅ toHaveBeenNthCalledWith(호출 횟수, 예상 인자)
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});
```

### 📝 Mocking 코드 분석
#### 1️⃣ vi.mock('react-router-dom', async () => {...})
- react-router-dom의 useNavigate를 모킹(mocking) 하여 테스트에서 네비게이션을 실제로 수행하지 않음.
- vi.importActual('react-router-dom')을 사용하여 원래의 react-router-dom 기능을 유지하면서, useNavigate만 변경.

#### 2️⃣ const navigateFn = vi.fn();
- vi.fn()은 Vitest의 Mock Function으로, useNavigate가 반환하는 가짜 navigate 함수 역할을 합니다.
- 실제 navigate('/경로')를 실행하는 것이 아니라, 함수가 호출되었는지만 검증합니다.

```javascript
const navigateFn = vi.fn();
```

#### 3️⃣ toHaveBeenNthCalledWith(1, '/')
- navigate 함수가 “/” 경로로 올바르게 호출되었는지 확인하는 테스트 매처.
- 1은 몇 번째 호출인지, "/"는 expect되는 인자값.

```javascript
expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
```

✅ 테스트 성공 조건
•	navigateFn이 한 번 호출되었는가?
•	호출된 경로는 '/'인가?

### 🎯 정리

✅ useNavigate는 브라우저 히스토리를 변경하는 훅이므로, 실제 네비게이션이 아닌 Mocking을 통해 호출 여부만 검증해야 함.
✅ vi.mock()을 활용하면 특정 모듈의 일부만 모킹할 수 있으며, 원래 기능은 유지 가능.
✅ expect(navigateFn).toHaveBeenNthCalledWith(1, '/')을 통해 올바른 경로로 navigate가 실행되었는지 검증 가능.

---

## 🧪 Mocking 초기화 (Teardown)

> **각 테스트의 독립성과 안정성을 보장하기 위해** Mocking을 초기화해야 한다.  
> `Vitest`에서는 **`resetAllMocks`, `clearAllMocks`, `restoreAllMocks`**을 활용하여 초기화를 수행할 수 있다.

### **✅ 왜 Mock을 초기화해야 할까?**
- **테스트 간 독립성을 보장하기 위해**  
  → 이전 테스트의 Mock 데이터가 다음 테스트에 영향을 주지 않도록 해야 함.
- **불필요한 메모리 사용 방지**  
  → Mock 함수는 호출 내역을 저장하므로, 초기화하지 않으면 메모리 사용량 증가 가능.
- **예상치 못한 테스트 실패 방지**  
  → 이전 테스트의 잔여 데이터 때문에 테스트가 실패할 수 있음.


### **🔍 Mocking 초기화 방법**
#### **1️⃣ `vi.clearAllMocks()`**
> **모든 Mock 함수의 호출 내역을 초기화**  
> → Mock 함수가 **몇 번 호출되었는지(`toHaveBeenCalledTimes`)** 확인하는 테스트에 유용.

#### **2️⃣ `vi.resetAllMocks()`**
> **Mock 함수의 호출 내역 + 반환값 & 구현 내용까지 초기화**
> → Mock 함수가 특정 값을 반환하는 경우(mockReturnValue) 초기화됨.

#### **2️⃣ `3️⃣ vi.restoreAllMocks()`**
> **Mock이 적용된 원래 함수로 복원**
> → vi.spyOn()으로 Mocking된 함수의 원래 동작을 되돌릴 때 사용.

### 🎯 Mocking 초기화 정리

| 함수 | 설명 | 초기화 내용 |
|------|---------------------------------|---------------------------------|
| **`vi.clearAllMocks()`** | 모든 Mock 함수의 **호출 내역 초기화** | `mock.calls.length` 값 초기화 |
| **`vi.resetAllMocks()`** | Mock 함수의 **반환값 & 구현 내용 초기화** | `mockReturnValue`, `mockImplementation` 초기화 |
| **`vi.restoreAllMocks()`** | **spyOn으로 Mock된 원래 함수로 복원** | `vi.spyOn()` 적용된 함수 초기 상태로 복구 |


### **💡 추천 활용법**
- **`vi.clearAllMocks()`**  
  → **각 테스트의 호출 횟수를 초기화**할 때 사용.  
  → ex) `toHaveBeenCalledTimes()` 검사 시 불필요한 호출 내역 제거.

- **`vi.resetAllMocks()`**  
  → **Mock의 반환값까지 초기화해야 할 때** 사용.  
  → ex) `mockReturnValue`로 설정한 값 초기화 필요할 경우.

- **`vi.restoreAllMocks()`**  
  → **spyOn으로 Mock된 원래 함수를 되돌릴 때** 사용.  
  → ex) `console.log` 같은 글로벌 함수를 Mocking한 후 원래 상태로 복구할 때.


### 🚀 Mock 초기화를 afterEach에서 자동 실행하기
이제 `afterEach`에서 Mocking 초기화를 적용하여 **각 테스트가 독립적으로 실행되도록 설정**하면 안정적인 테스트 환경을 만들 수 있습니다! 🚀

