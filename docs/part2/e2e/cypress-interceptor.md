# 📚 서버 요청 가로채기 : `cy.intercept()`

## E2E 테스트에서 모킹이 왜 필요할까?

- 테스트 환경 DB에 불필요한 데이터가 과하게 쌓이는 것을 방지하기 위함
- 워크플로우 실행 중 실패 케이스를 검증해야하는 경우
- 워크플로우 내에서 서드파티 API나 외부 앱을 사용하는 경우

---

## `cy.intercept()`란?
> 네트워크 요청을 가로채 응답을 조작하는 기능으로, Cypress에서 **`stubbing`**과 **`spying`**을 모두 수행할 수 있습니다.

- **`stubbing`**: 특정 네트워크 요청에 대해 미리 정해진 응답을 반환하는 것
- **`spying`**: 요청과 응답에 대한 호출 정보를 기록해 두는 것

---

## `cy.intercept()` 사용법

### **기본 문법**
```javascript
cy.intercept(method, url, response?)
```

| 매개변수      | 설명 |
|:---------------|:----------------------------|
| **`method`**    | HTTP 메서드 (GET, POST 등) |
| **`url`**       | 요청을 가로챌 URL 패턴 |
| **`response`**  | (선택) 반환할 응답 데이터 (Stub) |

---

## 예제

```javascript
beforeEach(() => {
  cy.visit('/register');
});

const submitAndCheckMsg = (text) => {
  cy.findByText('가입').click();
  cy.findByText(text).should('exist');
};

// ✅ 성공 시: '가입 성공!'
it('성공적으로 회원 가입이 완료되었을 경우 "가입 성공!" 문구가 노출되며 로그인 페이지로 이동한다', () => {
  cy.intercept('POST', 'http://localhost:3000/users', { statusCode: 200 });

  cy.findByLabelText('이름').type('joker');
  cy.findByLabelText('이메일').type('joker@email.com');
  cy.findByLabelText('비밀번호').type('password123');

  submitAndCheckMsg('가입 성공!');
  cy.visit('/');
});

// ❌ 실패 시: '문제가 발생했습니다.'
it('회원 가입이 실패했을 경우 "잠시 문제가 발생했습니다! 다시 시도해 주세요." 문구가 노출된다', () => {
  cy.intercept('POST', 'http://localhost:3000/users', { statusCode: 401 });

  cy.findByLabelText('이름').type('joker');
  cy.findByLabelText('이메일').type('joker@email.com');
  cy.findByLabelText('비밀번호').type('password123');

  submitAndCheckMsg('잠시 문제가 발생했습니다! 다시 시도해 주세요.');
});
```

---

## `cy.intercept()` 추가 기능

### 1. **`req.continue()` 사용하기**
> 원본 요청을 그대로 보내면서 일부 데이터만 수정하거나 로깅할 때 유용합니다.

```javascript
cy.intercept('POST', '/users', (req) => {
  req.continue((res) => {
    res.body = { ...res.body, message: '가입 성공 (모킹된 응답)' };
  });
}).as('register');

cy.findByText('가입').click();
cy.wait('@register').its('response.statusCode').should('eq', 200);
cy.findByText('가입 성공 (모킹된 응답)').should('exist');
```

---

### 2. **`.as()` 및 `.wait()`로 요청 대기 및 검증**
> `as()`는 요청에 별칭을 부여하고, `.wait()`는 해당 요청이 완료될 때까지 대기하는 명령어입니다.

```javascript
cy.intercept('POST', '/users', { statusCode: 200 }).as('register');

cy.findByText('가입').click();
cy.wait('@register').its('response.statusCode').should('eq', 200);
cy.findByText('가입 성공!').should('exist');
```


