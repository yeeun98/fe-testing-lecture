# 📘 Cypress 실전 예제: cy.session()과 커스텀 명령어로 중복 제거하기

## 🚀 `cy.session()`을 이용한 Cypress 로그인 최적화

>`cy.session()`은 Cypress v9.2.0에 도입된 기능으로, **로그인 절차의 반복을 방지**하고 테스트 성능을 최적화하는 기능.  
이 문서에서는 Cypress에서 `cy.session()`을 활용해 로그인 상태를 유지하는 방법과 작동 원리를 정리하였습니다.

### 설명

```js
cy.session(name, setup, options)
```

| 매개변수       | 설명 |
|:----------------|:--------|
| **`name`**     | Cypress가 세션을 구분하는 **고유 키**입니다. (여기서는 `username`) |
| **`setup`**    | 세션을 설정하는 **콜백 함수**입니다. 여기에서 로그인 절차가 수행됩니다. |
| **`options`**  | (선택) 세션 검증 등을 위한 옵션입니다.(예: `validate()`를 이용한 유효성 검사, `cacheAcrossSpecs()` 를 이용해 다른 스펙 파일에서도 세션 공유) |
|||

1. `validate` 옵션 사용 (세션 유효성 검사)

    ```js
    cy.session('user-session', () => {
      cy.visit('/login');
      cy.findByLabelText('이메일').type('maria@mail.com');
      cy.findByLabelText('비밀번호').type('12345');
      cy.findByLabelText('로그인').click();
      cy.location('pathname').should('eq', '/');
    }, {
      validate: () => cy.getCookie('auth_token').should('exist')
    });
    ```

2. `cacheAcrossSpecs` 옵션 사용 (다른 스펙 파일에서도 세션 공유)
    ```js
    cy.session('user-session', () => {
      cy.visit('/login');
      cy.findByLabelText('이메일').type('maria@mail.com');
      cy.findByLabelText('비밀번호').type('12345');
      cy.findByLabelText('로그인').click();
      cy.location('pathname').should('eq', '/');
    }, {
      cacheAcrossSpecs: true
    });
    ```

### 코드 예제
```javascript
Cypress.Commands.add('login', () => {
  const username = 'maria@mail.com';
  const password = '12345';

  cy.session(username, () => {
    cy.visit('/login');

    cy.findByLabelText('이메일').type(username);
    cy.findByLabelText('비밀번호').type(password);
    cy.findByLabelText('로그인').click();

    // 로그인 프로세스가 완료된 후 세션 데이터가 저장되도록 보장
    cy.location('pathname').should('eq', '/');
  });

  cy.visit('/');
});
```

### 세션 저장 방식

> `cy.session()`은 다음 데이터를 Cypress의 메모리 캐시에 저장하고 복원합니다:

- 쿠키 (Cookies)  
- 로컬 스토리지 (Local Storage)  
- 세션 스토리지 (Session Storage)  

### 실제 세션 데이터 구조

> 예제 코드가 실행될 경우 Cypress는 다음 데이터를 저장합니다

#### 🔍 세션 데이터 예시 (.session.json)
```json
{
  "maria@mail.com": {
    "cookies": [
      {
        "name": "auth_token",
        "value": "abcd1234",   // 서버가 발급한 인증 토큰 값
        "domain": "localhost",
        "path": "/",
        "secure": false,
        "httpOnly": true
      }
    ],
    "localStorage": {},
    "sessionStorage": {}
  }
}
```

### 유의사항
- Cypress는 `cy.session()` 호출 시 현재 도메인 기준으로 세션 데이터를 저장합니다.
- `cy.visit()` 호출 시 Cypress는 해당 도메인의 세션만 복원합니다.
- Cypress 종료 시 `.session.json`에 저장된 데이터는 사라지므로, Cypress 실행 간에만 유효합니다.

<br/>

---

<br/>

## 특정 파일에서만 반복되는 단언/명령어 정리

> 특정 파일에서만 반복적으로 사용되는 **단언**이나 **커맨드**를 별도의 함수로 추상화하여 관리하면 다음과 같은 장점이 있다.

✅ **코드 중복 제거**  
✅ **가독성 향상**  
✅ **유지보수 용이**

---

### 예제: 상품 카드 개수 확인 함수

예를 들어, 다음과 같이 동일한 단언이 반복된다면

```javascript
it('초기 상품은 20개가 노출된다', () => {
  cy.findAllByTestId('product-card').should('have.length', 20);
});

it('show more 버튼을 클릭할 경우 상품이 20개 더 노출된다', () => {
  cy.findByText('Show more').click();
  cy.findAllByTestId('product-card').should('have.length', 40);
});
```
이러한 패턴을 함수로 추상화하면 다음과 같이 정리할 수 있다.
```js
// 특정 파일에서만 반복되는 단언을 함수화
const assertProductCardLength = length => {
  cy.findAllByTestId('product-card').should('have.length', length);
};

// 이후 테스트에서 반복되는 단언을 호출
it('초기 상품은 20개가 노출된다', () => {
  assertProductCardLength(20);
});

it('show more 버튼을 클릭할 경우 상품이 20개 더 노출된다', () => {
  cy.findByText('Show more').click();
  assertProductCardLength(40);
});
```

### 왜 별도 함수로 추상화해야 할까?

1. 코드 중복 제거  
	•	동일한 단언이 여러 테스트에서 반복될 경우 함수화하면 중복 코드 제거로 관리가 수월해진다.  
2. 가독성 향상  
	•	각 테스트가 테스트 의도에 집중할 수 있어 이해하기 쉽다.
3. 유지보수 편의성  
	•	만약 product-card의 데이터 테스트 ID가 변경될 경우, 한 곳만 수정하면 전체 테스트를 쉽게 유지보수할 수 있습니다.
  (해서 CSS 선택자보다는 데이터 속성을 사용하는 것이 바람직합니다. (`data-testid` 권장))