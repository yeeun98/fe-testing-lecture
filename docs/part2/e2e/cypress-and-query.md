# 🧪 Cypress와 쿼리 정리

이 문서는 **Cypress**에서의 쿼리 사용과 관련된 개념 및 실전 예제를 정리하였습니다.  
테스트의 신뢰성과 유지보수를 높이기 위한 Cypress의 강력한 기능인 **체이닝(Chaining)**, **Subject**, **Retry-ability** 등에 대한 내용입니다.

---

## 🚀 1. Cypress의 핵심 개념

### 🔹 **Subject**
~~~
subject는 Cypress에서 현재 테스트 커맨드가 조작하고 있는 “대상”을 의미하는 용어입니다.
쉽게 말해, Cypress의 각 커맨드는 특정 DOM 요소 또는 값을 기준으로 동작하는데, 이때 Cypress가 추적하고 있는 그 대상을 subject라고 합니다.
~~~
- Cypress는 커맨드를 **Promise 체이닝**을 통해 관리하며, 각 커맨드는 **체인이 종료되거나 오류가 발생할 때까지 대기**합니다.
- Cypress는 이러한 동작을 제어하기 위해 내부적으로 **다음 커맨드의 대상을 subject**로 관리합니다.

**예시: Subject 체이닝**
```javascript
cy.get('input[type="text"]') // Subject: 'input' 엘리먼트
  .type('hello')             // 'input'에 텍스트 입력
  .should('have.value', 'hello'); // 입력 값이 'hello'인지 확인
```

**➡️ 여기서 .get()이 찾은 요소(input)이 subject가 되며, 이후의 .type()과 .should()가 이 subject에 연속적으로 실행됩니다.**

---

### 🔎 **API 유형**

> Cypress의 API는 다음과 같이 **3가지 유형**으로 구분됩니다

| **유형**         | **설명**                             | **예시**               |
|:------------------|:------------------------------------|:-----------------------|
| **Query API**       | DOM 요소를 찾는 명령어 (자동 재시도 O) | `cy.get()`, `cy.findByLabelText()` |
| **Assertion API**   | Assertion(단언) 명령어 (검증 로직)     | `cy.should()`, `cy.expect()` |
| **Non-Query API**   | 단 한 번만 실행되는 명령어 (재시도 X)   | `cy.click()`, `cy.visit()` |


#### 🔹 **Query API**  
> Cypress에서 DOM 요소를 찾기 위한 명령어로, **자동으로 재시도(Retry-ability)** 기능이 활성화됩니다.  

- `cy.get()`
    > Cypress에서 가장 많이 사용되는 DOM 탐색 명령어로, **CSS Selector**를 통해 요소를 선택합니다.  
    > Cypress의 **자동 재시도(Retry-ability)** 기능이 활성화되어, 요소가 나타날 때까지 기다렸다가 탐색을 시도합니다.  

    - **특징**
        - jQuery와 유사한 **CSS Selector** 문법을 사용합니다.
        - `.as()`로 선언한 **별칭(Alias)**과 함께 사용하면 더 간결한 테스트 코드를 작성할 수 있습니다.

    - **사용 예시**
        ```javascript
        // 별칭 없을 때
        cy.get('input[type="text"]')       // CSS Selector로 'input' 요소 선택
        .type('hello')                    // 해당 요소에 'hello' 입력
        .should('have.value', 'hello');  // 입력 값 검증
        ```
        ```javascript
        // 별칭 있을 때
        beforeEach(() => {
            cy.get('button[type="submit"]').as('submitBtn'); // '제출' 버튼에 별칭 선언
        });

        it('로그인 버튼 클릭 시 이동 확인', () => {
            cy.get('@submitBtn').click(); // 별칭을 통해 DOM 탐색 간소화
            cy.assertUrl('/dashboard');
        });
        ```
        - 별칭 사용의 장점
            - ✅ DOM 구조가 바뀌어도 코드 수정이 간편
            - ✅ 가독성이 좋아지고 중복 코드를 줄일 수 있음
            - ✅ CSS Selector 의존성 최소화로 유지보수에 유리

#### 🔹 Assertion API
> 특정 조건을 검증하는 명령어로, 체이닝 형태로 주로 사용됩니다.

**예시**
```javascript
cy.get('input[type="text"]')
  .type('hello')
  .should('have.value', 'hello'); // Assertion: 입력 값 검증
```

#### 🔹 Non-Query API
> Cypress에서 DOM을 찾지 않고, 단 한 번만 실행되는 명령어입니다.
.click(), .visit() 등은 DOM 구조에 의존하므로, 신중하게 사용해야 합니다.

**예시**
```javascript
cy.visit('/login');       // 한 번만 실행됨 (재시도 X)
cy.findByText('로그인').click(); // 클릭 이벤트 실행 (재시도 X)
```
---

### 🔹 Retry-ability
- Cypress의 강력한 기능으로, 특정 조건이 만족될 때까지 자동으로 재시도하는 기능입니다.
- 예를 들어, API 응답이 늦거나 DOM 렌더링이 지연될 경우 Cypress는 자동으로 재시도하며 안정적으로 테스트를 실행합니다.


**예시: Retry-ability**
```javascript
cy.get('.loading-indicator').should('not.exist'); // 요소가 사라질 때까지 재시도
```
**➡️ `.get()`으로 찾은 요소가 처음엔 존재할 수 있지만, Cypress는 4초(`defaultCommandTimeout`) 동안 지속적으로 확인하며 요소가 사라질 때까지 재시도합니다.**
