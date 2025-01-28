### 목차
- [React Testing Library](#React-Testing-Library)
- [spy 함수](#spy-함수)
- [Vitest에서 제공하는 Mock Function 관련 매처](#Vitest에서-제공하는-Mock-Function-관련-매처)

---

### React Testing Library
- UI 컴포넌트를 사용자가 사용하는 방식으로 테스트
- 사용자가 앱을 사용하는 방식과 테스트 방식이 유사할수록 신뢰성은 향상됨
- DOM과 이벤트 인터페이스를 기반으로 요소를 조회하고, 다양한 동작을 시뮬레이션 할 수 있음

DOM 요소를 조회하기 위한 쿼리는 다양하지만 우선 순위가 존재한다.
🔗 [testing library query priority](https://testing-library.com/docs/queries/about)

### spy 함수
> 테스트 코드에서 함수의 호출 여부, 인자, 반환 값 등 함수 호출에 관련된 다양한 값을 저장
> callback함수나 이벤트 핸들러가 제대로 작동되었는지 확인하고 싶을 때 주로 사용

```javascript
const spy = vi.fn(); // 스파이 함수
```

---

### Vitest에서 제공하는 Mock Function 관련 매처
- toHaveBeenCalled
: **모의 함수(Mock Function)**가 최소 한 번이라도 호출되었는지 확인합니다.
: 호출된 인수나 횟수를 신경 쓰지 않고, 호출 자체만 체크합니다.
- toHaveBeenCalledWith
: **모의 함수(Mock Function)**가 **특정 인수(arguments)**와 함께 호출되었는지 확인합니다.
: 호출된 인수의 값과 순서가 정확히 일치해야 통과합니다.

---

### Testing Library - userEvent
> 클릭 키보드 이벤트등 다양한 사용자의 이벤트를 시뮬레이션 할 수 있게하는 라이브러리

```javascript
// setup이라는 함수를 통해 반환받은 인스턴스를 통해 api를 사용할 수 있음
const user = userEvent.setup();
```

#### 🧪 `userEvent.type()` - Testing Library

`userEvent.type()`은 **Testing Library**에서 제공하는 메서드로, **사용자가 입력 필드(`input`, `textarea`)에 텍스트를 입력하는 동작**을 시뮬레이션합니다.  
단순히 값만 변경하는 것이 아니라, 실제로 타이핑할 때 발생하는 이벤트(`keydown`, `keypress`, `keyup`, `input`, `change`)를 발생시켜 **현실적인 동작을 재현**하는 것이 특징입니다.


#### 📌 **기본 사용법**

1. 값을 입력
```tsx
it('텍스를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();

  // prop으로 onChange 시에 발생할 스파이 함수 전달
  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // userEvent의 type함수는 사용자가 입력 필드(`input`, `textarea`)에 텍스트를 입력하는 동작
  await user.type(textInput, 'test');

  // spy 함수가 입력한 값인 'test'와 함께 호출되었는지 확인
  expect(spy).toHaveBeenCalledWith('test');
});
```

2. Enter키 입력
```tsx
it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onEnter={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // text뒤에 {Enter}을 입력하면 엔터키가 입력된 것처럼 작동
  await user.type(textInput, 'test{Enter}');

  expect(spy).toHaveBeenCalledWith('test');
});
```

#### 🧪 `userEvent.click()`

`userEvent.click()`은 **Testing Library**에서 제공하는 메서드로, 사용자가 버튼, 링크, 체크박스 등 **DOM 요소를 클릭하는 동작을 시뮬레이션**합니다.  
`mousedown`, `mouseup`, `focus`, `click` 등 실제 브라우저에서 발생하는 이벤트를 재현합니다.

#### 📌 **기본 사용법**

1. focus
```tsx
it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
  // 포커스 활성화하는 방법
  // 1. Tab 키로 인풋 요소로 포커스 이동
  // 2. 인풋 요소로 클릭했을 때
  // 3. textInput.focus()로 직접 포커스 이벤트 발생
  const spy = vi.fn();

  const { user } = await render(<TextField onFocus={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);
  // click과 연관 -> 포커스, 마우스다운, 마우스업 등...

  expect(spy).toHaveBeenCalled();
});
```