## 🧪 msw로 API 모킹하기

>통합 테스트에서 API를 호출하는 컴포넌트를 시뮬레이션하기 위해 프로젝트에서 사용하는 **TanStack Query 설정**과 **API 모킹(Mocking)**이 필요합니다.

<br>

## ✔️ TanStack Query

> **TanStack Query**는 API 호출에 따른 **로딩, 에러 상태 처리, 페이지네이션 캐싱** 등의 편의성을 제공하는 라이브러리.
> 테스트 환경에서는 기존 설정(ex: `retry`)이 테스트에 영향을 주지 않도록 설정을 조정해야한다.

### 테스트용 설정 (예: `render.jsx`)
- **Retry 비활성화:** 테스트 중 불필요한 재시도를 방지하기 위해 `retry` 옵션을 꺼야 합니다.
- **테스트 캐싱 관리:** 각 테스트마다 초기화된 상태를 유지하도록 설정합니다.

    ```jsx
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

    // 테스트 전용 Query Client 설정
    const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
        queries: {
            retry: false, // 재시도 비활성화
            cacheTime: 0, // 캐싱 비활성화
        },
        },
    });

    // Query Client를 포함한 테스트 환경 설정
    const renderWithClient = (ui) => {
    const testQueryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={testQueryClient}>
        {ui}
        </QueryClientProvider>
    );
    };
    ```

<br/>

## ✔️ Mock Service Worker (MSW)

> `Mock Service Worker(MSW)`는 **Node.js**와 **브라우저 환경**에서 사용할 수 있는 **API 모킹 라이브러리**이다.

- 브라우저 환경: `서비스 워커(Service Worker)`를 사용하여 네트워크 요청을 가로챕니다.
- Node.js 환경: `XHR, Fetch 등의 요청을 인터셉트하는 라이브러리`를 내부적으로 사용합니다.

### MSW 설정
- **setup과 teardown 활용:**  
  테스트 실행 **전**에 API 모킹을 활성화하고, 테스트 실행 **후**에 이를 해제하여 테스트 환경을 초기화합니다.

  ```js
   // setupTests.js
    import { handlers } from '@/__mocks__/handlers';

    /* msw */
    export const server = setupServer(...handlers);

    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        // 모킹된 모의 객체 호출에 대한 히스토리를 초기화
        // 모킹된 모듈의 구현을 초기화하지 않는다. -> 모킹된 상태로 유지됨
        // -> 모킹 모듈 기반으로 작성한 테스트가 올바르게 실행
        // 반면, 모킹 히스토리가 계속 쌓임(호출 횟수나 인자가 계속 변경) -> 다른 테스트에 영향을 줄 수 있음
        vi.clearAllMocks();
    });

    afterAll(() => {
        // 모킹 모듈에 대한 모든 구현을 초기화
        vi.resetAllMocks();
        server.close();
    });
  ```


### 👩🏻‍💻 예제 코드

#### MSW 핸들러 정의
```javascript
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: '123', username: 'test_user' })
    );
  }),
];
```

<br>

## 🎯 요약

### TanStack Query
	•	API 호출 편의성 제공 (로딩, 에러 상태 처리, 캐싱 등).
	•	테스트 환경에서는 retry 비활성화, 캐싱 초기화 설정 필요.

### Mock Service Worker (MSW)
	•	API 모킹을 통해 네트워크 요청을 시뮬레이션.
	•	브라우저 환경에서는 서비스 워커를, Node.js 환경에서는 XHR 인터셉터 사용.
	•	테스트 실행 전후로 setup과 teardown을 통해 모킹 활성화/해제.