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

---

## 📌 스토리 (Story) 작성

### CSF(Component Story Format)
- .stories.(tsx|ts|jsx|js) 확장자로 끝나는 파일에 작성
- 메타 데이터 + 개별 스토리로 구성
- 메타 데이터 → default export로 정의 (제목, 컴포넌트, 필드 정보 등)
- 스토리 → named export로 정의 (각 시나리오별 설정)

```js
// 메타 데이터 예제
export const Default = {
  name: '기본',
  args: {
    product,
  },
};

// 스토리 예제
export const LongTitle = {
  args: {
    product: {
      ...product,
      title:
        'Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example',
    },
  },
  name: '타이틀이 긴 경우',
};

export const LongCategoryName = {
  args: {
    product: {
      ...product,
      category: {
        name: 'Long Category Long Category Long Category Long Category',
      },
    },
  },
  name: '카테고리가 긴 경우',
};
```

✔ `변수명(LongCategoryName)`은 스토리북 내부에서 관리하는 이름<br/>
✔ `name: '카테고리가 긴 경우'`를 추가하면 Storybook UI에서 이 이름으로 표시됨<br/>
✔ 별도로 `name`을 정의하지 않으면 `변수명(LongCategoryName)`이 그대로 Storybook에 표시됨<br/>
✔ 각각의 스토리는 `args`를 통해 다른 상태를 시뮬레이션<br/>
✔ `argTypes`를 사용하면 컨트롤 패널에서 직접 값을 변경 가능<br/>

## 📌 args와 Play의 역할

### 1️⃣ args: 동적으로 인자 값을 변경하여 UI 반영

```javascript
export const Default = {
  args: {
    product,
  },
};
```
- UI에서 동적으로 값 변경 가능
- 스토리북 Controls 패널에서 변경 가능

### 2️⃣ Play: 스토리를 렌더링한 후 사용자 상호작용을 시뮬레이션

- Play 함수를 사용하면 렌더링 후 특정 동작을 실행할 수 있음
- 예를 들어, 버튼 클릭 후 상태 변화를 확인 가능
- 테스트 자동화와 비슷한 개념으로, 버튼 클릭, 입력 필드 값 변경, 폼 제출 등의 UI 이벤트를 실행 가능.

```javascript
export const WithValue = {
  name: '가격이 입력된 상태',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const [min, max] = canvas.getAllByRole('textbox');
    await userEvent.type(min, '300');
    await userEvent.type(max, '40000');
  },
};
```

- name: '가격이 입력된 상태' → Storybook UI에서 표시될 이름
- play 함수 실행 후 자동으로 사용자 입력을 시뮬레이션

#### ✅ Play 함수의 주요 활용 사례

✔ 버튼 클릭 후 UI 변경 확인<br/>
✔ 입력 필드 값 변경 테스트<br/>
✔ 폼 제출 후 결과 검증<br/>
✔ 모달 열기/닫기 동작 테스트<br/>


---

## 📌 스토리 작성 대상

**✔ 단순하게 UI만 렌더링하는 컴포넌트 → ✅ 스토리 작성이 쉬움**<br/>
**✔ 비즈니스 로직이 응집된 컴포넌트 → ❌ 스토리 작성이 어려울 수 있음**<br/>

**💡 비즈니스 로직과 UI를 분리하여 설계하는 것이 중요!**<br/>
- UI 중심 컴포넌트는 스토리북에서 테스트
- 데이터 중심 컴포넌트는 통합 테스트로 검증