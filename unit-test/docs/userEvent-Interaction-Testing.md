## 🔥 fireEvent vs 🎯 userEvent - 올바른 테스트 방법 선택하기

### 🔹 fireEvent란?
`fireEvent`는 `@testing-library/react` 모듈에서 제공하는 내장 함수로, 특정 DOM 요소에서 **원하는 이벤트만 직접 발생**시킬 수 있다.

#### ✅ 특징
- DOM 이벤트를 **직접 트리거**(trigger)할 수 있음
- 원하는 이벤트만 발생시킬 수 있음
- 예제:
```jsx
import { render, fireEvent } from "@testing-library/react";

test("버튼 클릭 이벤트 테스트", () => {
  const handleClick = jest.fn();
  const { getByText } = render(<button onClick={handleClick}>Click me</button>);
  
  fireEvent.click(getByText("Click me"));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

### 🎯 userEvent란?
userEvent는 @testing-library/user-event 모듈에서 제공하는 API로, 실제 사용자 행동을 시뮬레이션하는 방식으로 이벤트를 발생시킨다.

#### ✅ 특징
- 사용자의 실제 상호 작용과 유사한 방식으로 이벤트가 발생
- 한 번의 click이 여러 개의 연쇄적인 이벤트를 발생시킴
(예: pointerdown → mousedown → pointerup → mouseup → click → focus)
- disabled 상태의 버튼이나, readonly 입력 필드처럼 사용자가 조작할 수 없는 요소는 자동으로 차단됨
- 예제:
```jsx
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("버튼 클릭 이벤트 테스트", async () => {
  const handleClick = jest.fn();
  const { getByText } = render(<button onClick={handleClick}>Click me</button>);

  await userEvent.click(getByText("Click me"));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

### 🔍 fireEvent vs userEvent 비교
| 비교 항목            | 🔥 fireEvent | 🎯 userEvent |
|----------------------|------------|-------------|
| **이벤트 발생 방식** | 단일 DOM 이벤트 실행 | 실제 사용자와 유사한 상호 작용 시뮬레이션 |
| **연쇄 이벤트 발생** | ❌ (단일 이벤트만 발생) | ✅ (`mousedown` → `mouseup` → `click` 등 연속 이벤트 발생) |
| **disabled 요소 처리** | 🚫 클릭 가능 (비활성화 무시) | ✅ 클릭 차단 (실제 브라우저와 동일) |
| **focus 이동** | ❌ (`click` 시 focus 이동 없음) | ✅ (`click` 시 자동으로 focus 이동) |
| **입력 테스트 (`input`)** | `fireEvent.change()` 필요 | `userEvent.type()` 사용 가능 |
| **사용 추천 상황** | `userEvent`에서 지원하지 않는 특정 이벤트 발생 시 | 일반적인 UI 테스트 (권장) |

📌 **테스트의 신뢰성을 높이기 위해 `fireEvent`보다 `userEvent`를 우선적으로 활용하세요!**

---

### 💡 언제 fireEvent를 사용해야 할까?
- userEvent에서 지원하지 않는 특정 이벤트를 발생시켜야 할 때
- 예제:
userEvent.paste()가 지원하지 않는 경우, fireEvent를 활용 가능
```jsx
import { render, fireEvent } from "@testing-library/react";

test("input 값 변경 테스트", () => {
  const { getByRole } = render(<input type="text" />);
  const input = getByRole("textbox");

  fireEvent.change(input, { target: { value: "Hello, world!" } });

  expect(input.value).toBe("Hello, world!");
});
```

---

### 🏆 결론

- ✅ 가능한 한 userEvent를 사용하여 실제 사용자와 유사한 테스트를 작성하는 것이 좋dma
- ✅ fireEvent는 특정 이벤트만 필요할 때 보조적으로 사용

📌 테스트의 신뢰성을 높이기 위해 fireEvent보다 userEvent를 우선적으로 활용!