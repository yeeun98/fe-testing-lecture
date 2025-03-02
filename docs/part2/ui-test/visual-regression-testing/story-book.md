# 📌 Storybook이란?
~~~
Storybook은 UI 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구이다.
컴포넌트를 격리된 환경에서 렌더링하여 **디자인과 기능을 테스트**하고, 다양한 상태를 미리 확인할 수 있다.
~~~

---

## 📌 예제 코드 설명

아래 예제는 Storybook의 **Preview 설정 파일**입니다.  
이 파일에서는 **스토리북의 전역 설정, 데코레이터 및 기본적인 기능을 정의**합니다.

```javascript
/** @type { import('@storybook/react').Preview } */
import { withRouter } from 'storybook-addon-react-router-v6';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import { handlers } from '../src/__mocks__/handlers';
import withRHF from './withRHF';

import 'swiper/css';
import 'swiper/css/navigation';

const queryClient = new QueryClient();
initialize({
  onUnhandledRequest: 'bypass',
});

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers,
    },
  },
  decorators: [
    withRouter,
    mswDecorator,
    withRHF(false),
    Story => (
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
```

### 📍 주요 기능 설명

#### 1️⃣ 전역 설정 (parameters)
> 📌 Storybook에서 동작 방식을 설정하는 부분

- `actions`: onClick, onChange 같은 이벤트 핸들러 자동 감지
- `controls`: 컴포넌트 속성을 UI에서 조작할 수 있도록 활성화
- `matchers`: 색상 및 날짜 입력 필드를 자동으로 감지
- `msw`: Mock Service Worker(MSW)를 사용하여 API 요청을 모킹

#### 2️⃣ 데코레이터 (decorators)
> 📌 모든 스토리에 기본적으로 적용되는 설정 (예: 글로벌 컨텍스트, 스타일 적용 등)

**✔ withRouter (스토리북에서 라우팅 지원)**<br/>
- 스토리북에서 react-router를 사용할 수 있도록 추가
- Link 컴포넌트 같은 라우팅 관련 기능을 테스트할 때 필요

**✔ mswDecorator (MSW 적용)**<br/>
- API 요청을 모킹할 수 있도록 MSW 핸들러를 Storybook에 적용

**✔ withRHF(false) (React Hook Form 지원)**<br/>
- 폼 관련 컴포넌트를 테스트할 때 사용
- false 값은 초기 설정 옵션으로 활용

**✔ QueryClientProvider (React Query 지원)**<br/>
- 스토리북 내에서 React Query를 사용할 수 있도록 설정
- 컴포넌트가 데이터를 비동기적으로 가져올 때 실제 API를 호출하지 않고, 캐싱된 데이터를 활용 가능

**✔ CssBaseline (MUI 기본 스타일 적용)**<br/>
- Material-UI의 기본 스타일을 Storybook 전체에 적용