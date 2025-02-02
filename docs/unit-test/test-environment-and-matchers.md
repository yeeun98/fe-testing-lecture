## vitest 메서드 정리(it, test, describe)

### it 함수
> 테스트의 실행 단위로서 테스트 디스크립션, 기대 결과에 대한 코드를 작성
> it 함수는 test 함수의 alias로서 동일한 역할을 수행한다.

```javascript
it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    screen.debug();
    expect(textInput).toBeInTheDocument();
  });
```

### test 함수
> 단일 테스트 케이스를 정의하는 메서드로, 특정 동작이나 결과를 검증할 때 사용.

```javascript
test('adds two numbers', () => {
    expect(1 + 1).toBe(2);
});
```

### it과 test의 유사성과 차이점
- 유사성
> it과 test는 기능적으로 동일하지만, 스타일과 가독성의 차이에 따라 선택.

- 차이점
    - it: 자연스럽게 “It should …“로 이어지는 문장을 작성하고 싶을 때
    ```javascript
    it('should return true for valid inputs', () => {
    expect(isValidInput('test')).toBe(true);
    });
    ```

    - test: 간결하고 명확한 테스트를 작성하고 싶을 때.
    ```javascript
    test('returns true for valid inputs', () => {
    expect(isValidInput('test')).toBe(true);
    });
    ```

### describe
> 관련된 테스트를 그룹화하여 논리적으로 묶는 메서드.
> **사용 목적**: 테스트를 체계적으로 구조화 함

```javascript
describe('placeholder', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
    screen.debug();
    expect(textInput).toBeInTheDocument();
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder={'상품명을 입력해 주세요.'} />);
    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');
    screen.debug();
    expect(textInput).toBeInTheDocument();
  });
});
```

<br><hr />

## 단언(assertion)이란?
> 테스트가 통과하기 위한 조건을 기술하여 검증을 실행한다.

<br><hr />

## 매처함수
- 기대 결과를 검증하기 위해서 사용되는 API 집합
- vitest에서는 다양한 기본 매처를 제공하며, 이를토해 단언을 실행할 수 있다.
- [Vitest Expect API 문서](https://vitest.dev/api/expect.html)
- [Testing Library: jest-dom Custom Matchers](https://github.com/testing-library/jest-dom#custom-matchers)