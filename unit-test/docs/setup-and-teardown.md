## setup
> 테스트를 실행하기 전 수행해야 하는 작업

## 주요 함수
1. **`beforeAll`**
   - 모든 테스트가 실행되기 전에 한 번만 실행됩니다.
   - 공통 설정이나 연결 작업에 유용.
2. **`beforeEach`**
   - 각 테스트 이전에 실행됩니다.
   - 데이터베이스 초기화, 목(Mock) 객체 설정 등에 사용.

### 예제 코드
```javascript
beforeEach(() => {
  console.log("이 테스트 전에 실행됩니다.");
});

beforeAll(() => {
  console.log("테스트 전 한 번만 실행됩니다.");
});

test("예제 테스트", () => {
  expect(true).toBe(true);
});


test("예제 테스트 2", () => {
  expect(true).toBe(true);
});
```

```bash
테스트 전 한 번만 실행됩니다.
이 테스트 전에 실행됩니다.
이 테스트 전에 실행됩니다.
```

## teardown
> 테스트를 실행한 뒤 수행해야 하는 작업

### 주요 함수
1. **`afterEach`**
   - 각 테스트 이후에 실행됩니다.
   - 데이터 정리, 리소스 해제 등에 사용.
2. **`afterAll`**
   - 모든 테스트가 끝난 후 한 번만 실행됩니다.
   - 환경 정리, 로그 출력 등에 사용.

### 예제 코드
```javascript
afterEach(() => {
  console.log("이 테스트 이후에 실행됩니다.");
});

afterAll(() => {
  console.log("테스트 후 한 번만 실행됩니다.");
});

test("예제 테스트", () => {
  expect(true).toBe(true);
});
```

```bash
이 테스트 이후에 실행됩니다.
테스트 후 한 번만 실행됩니다.
```

## setup과 teardown의 나쁜 예
> 전역 변수를 사용한 조건 처리는 독립성을 보장하지 못하기에 신뢰성이 낮아지므로 지양하자 !

```javascript
let someCondition = false;

beforeEach(async () => {
  if(someCondition) {
    await render(<TextField className="my-class" />);
  } else {
    // ...
  }
});
```

## test의 setUpFiles 설정
> 전역적으로 테스트 실행 이전 혹은 이후에 실행해야하는 작업들이 존재할 시엔, setUp하는 파일을 별도로 생성하여 vite.config.js에서 test의 setUpFiles로 설정해주면 된다.

```javascript
// setUpTest.js
import '@testing-library/jest-dom';

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

...
```
```javascript
// vite.config.js
import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  ...
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/utils/test/setupTests.js',
  },
  resolve: {
    ...
  },
});

```

🔗 [setup과 teardown가이드](https://vitest.dev/api/#setup-and-teardown)