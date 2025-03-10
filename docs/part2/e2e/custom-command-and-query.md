# 🧪 커스텀 커맨드와 쿼리
~~~
Cypress에서는 반복적인 테스트 로직을 줄이기 위해 커스텀 커맨드(Custom Command)와 커스텀 쿼리(Custom Query)를 제공합니다.  
두 기능은 비슷해 보이지만, Retry-ability 지원 여부, subject 처리 방식 등에서 중요한 차이가 있습니다.
~~~

---

## 📋 1. **커스텀 쿼리 (Custom Query)**
> **[공식문서 보기](https://docs.cypress.io/api/cypress-api/custom-queries)**

### 특징
✅ **`Retry-ability` 지원** (조건 충족까지 Cypress가 자동으로 재시도)  
✅ **동기(Synchronous)로 동작**  
✅ Cypress의 **체이닝 구조**를 그대로 유지하며 subject를 기반으로 동작  
✅ **`Cypress.Commands.addQuery()`** 또는 **`Cypress.Commands.overwriteQuery()`**로 정의  

### 예제
```javascript
// 커스텀 쿼리: getCartButton()
Cypress.Commands.addQuery('getCartButton', () => {
  // `cy.now()`로 감싸 특정 쿼리를 호출 → subject를 받아 inner function에서 get 실행
  const getFn = cy.now('get', `[data-testid="cart-icon"]`);

  return subject => {
    // cart-icon testid를 가진 요소를 조회하는 get 쿼리
    // 우리가 원하는 subject를 기준으로 실행
    const btn = getFn(subject);

    return btn;
  };
});

// 커스텀 쿼리 사용 예시
it('성공적으로 로그인 되었을 경우 장바구니 아이콘이 노출된다', () => {
  cy.login();
  cy.getCartButton().should('exist'); // Cypress의 자동 재시도를 통해 안정적인 검증
});
```

**설명**
- `Cypress.Commands.addQuery()`는 Cypress의 체이닝 구조를 유지하면서도, `subject를 기반`으로 동작합니다.
- `cy.now()`는 Cypress의 쿼리를 감싸서 Cypress의 subject를 계속 유지하게 합니다.
- Cypress는 cart-icon이 나타날 때까지 **자동으로 재시도**합니다.
- DOM 탐색에 유리

---

## 📋 2. 커스텀 커맨드 (Custom Command)

> **[공식문서 보기](https://docs.cypress.io/api/cypress-api/custom-commands)**

### 특징
✅ **`Retry-ability` 미지원**  
✅ 비동기(Asynchronous)로 동작  
✅ subject를 명시적으로 넘겨주지 않으면 자동으로 전달되지 않음  
✅ `Cypress.Commands.add()` 또는 `Cypress.Commands.overwrite()`로 정의  

### 예제
```js
// login(), logout() 커스텀 커맨드
Cypress.Commands.add('login', () => {
  const username = 'maria@mail.com';
  const password = '12345';

  cy.visit('/login');

  cy.findByLabelText('이메일').type(username);
  cy.findByLabelText('비밀번호').type(password);
  cy.findByLabelText('로그인').click();

  cy.findByText('Maria'); // 로그인 완료 시까지 기다림
});

...

Cypress.Commands.add('assertUrl', url => {
  // should()는 조건이 만족될 때까지 Cypress가 자동 재시도
  cy.url().should('eq', `${Cypress.env('baseUrl')}${url}`);
});

// 사용 예시: login() 커스텀 커맨드 사용
it('성공적으로 로그인 되었을 경우 메인 홈 페이지로 이동하며, 사용자 이름 "Maria"와 장바구니 아이콘이 노출된다', () => {
  cy.login(); // 반복되는 로그인 로직을 한 줄로 대체

  cy.assertUrl('/');
  cy.findByText('Maria').should('exist');
  cy.findByTestId('cart-icon').should('exist');
});
```

**실행 순서**  
✅ cy.login() 실행 → 내부의 .findBy()와 .should()가 완료될 때까지 대기  
✅ cy.assertUrl() 실행 → 내부의 .should()가 URL이 변경될 때까지 대기  
✅ cy.findByText('Maria') 실행 → .should()로 요소가 나타날 때까지 대기  

➡️ 커스텀 커맨드는 본래 비동기적으로 동작하지만 `findBy()`, `should()` 덕분에 Cypress는 각 명령어가 완료될 때까지 기다린 후 다음 명령어를 실행하는 것처럼 보입니다.
➡️ 위 기능덕에 Cypress는 await 없이도 명령어가 순차적으로 실행되도록 자동 제어합니다.  

---

## 🔍 3. **커스텀 쿼리 vs 커스텀 커맨드 차이점**

| **특성**                    | **커스텀 쿼리 (Custom Query)**     | **커스텀 커맨드 (Custom Command)** |
|:----------------------------|:------------------------------------|:------------------------------------|
| **Retry-ability (자동 재시도)**| ✅ 지원                              | ❌ 미지원                              |
| **체이닝 구조 유지**             | ✅ 가능                              | ❌ 별도의 `cy.wrap()` 필요               |
| **subject 전달 방식**         | 자동으로 전달됨                        | 별도의 처리 필요 (`cy.wrap()` 사용)         |
| **적합한 사용 상황**            | **DOM 탐색** / **요소 감지** 시 사용      | **로그인**, **API 호출** 등 비동기 로직      |

---

## 🎯 4. 정리

✅ UI 요소 탐색 → Cypress.Commands.addQuery()로 커스텀 쿼리 생성  
✅ API 호출, 로그인 로직 등 비동기 처리 → Cypress.Commands.add()로 커스텀 커맨드 생성  
✅ 재시도가 필요한 경우 → 커스텀 쿼리 / 단순 로직은 커스텀 커맨드  

이렇게 Cypress의 커스텀 커맨드와 쿼리를 적절히 활용하면 테스트 코드의 가독성과 유지보수성을 크게 높일 수 있음  
