# 🧪 Cypress로 E2E 테스트 작성하기

## 📌 단위·통합에서 작성한 테스트를 E2E에서도 작성?
```js
it('이메일을 입력하지 않고 로그인 버튼을 클릭할 경우 "이메일을 입력하세요" 경고 메세지가 노출된다', () => {});
it('비밀번호를 입력하지 않고 로그인 버튼을 클릭할 경우 "비밀번호를 입력하세요" 경고 메세지가 노출된다', () => {});
it('잘못된 양식의 이메일을 입력한 뒤 로그인 버튼을 클릭할 경우 "이메일 양식이 올바르지 않습니다" 경고 메세지가 노출된다', () => {});
```

> 위 테스트는 통합테스트에서도 확인 가능한데 그렇다면 e2e에서도 위를 검증하면 중복 검증인가?<br/>
> 답은 `NO`! 아래가 이유이다.

✔ 컴포넌트 일부가 아닌 앱 자체에 대한 기능이 동작하는지 검증<br/>
→ 단위∙통합 테스트는 일부 컴포넌트의 조합을 테스트<br/>
→ 앱이 구동되었을 때도 동일하게 동작해야 안정성이 더욱 높아짐<br/>

✔ 통합 테스트에서 검증한 기능을 파악하는 과정은 비효율적<br/>
→ 워크 플로우가 클수록 파악하는데 많은 시간이 소요됨<br/>

<br/>

## 📌 Cypress의 특징
- ✔ Cypress는 `findBy`와 `findAllBy*`를 사용해야함 -> `retry-ability` 기능 사용
- ✔ Cypress는 `Chai`, `Chai-jQuery`, `Sinon-Chai`의 문법을 사용할 수 있도록 확장되어 있음
- ✔ `Chai-jQuery` → 주로 DOM 객체에 대한 단언
- ✔ `Sinon-Chai` → 주로 Stub이나 Spy에 대한 단언

[🔗 Cypress Assertions 문서](https://docs.cypress.io/app/references/assertions#Chai)

<br/>

## 🔧 예제에서 활용한 Cypress 주요 문법
- `cy.` prefix
    > Cypress의 내장 API 사용

- `beforeEach`
    > Setup 단계에서 사용

    ```js
    beforeEach(()=> {
        //visit: baseUrl(cypress.config.js에서 설정)을 기준으로 웹 페이지로 접속할 수 있도록 돕는 함수
        cy.visit('/login');
    });
    ```

- `visit()` 함수
    > 특정 페이지 방문
    > baseUrl(cypress.config.js에서 설정)을 기준으로 웹 페이지로 접속할 수 있도록 돕는 함수

    ```js
    beforeEach(()=> {
        //visit: baseUrl(cypress.config.js에서 설정)을 기준으로 웹 페이지로 접속할 수 있도록 돕는 함수
        cy.visit('/login');
    });
    ```

- `should()` 함수
    > Cypress의 단언 (내부적으로 Chai, Chai-jQuery, Sinon-Chai 확장)

    ```js
    it('회원 가입 클릭 시 회원 가입 페이지로 이동한다', () => {
        // E2E에서는 단위, 통합 테스트처럼 라우터 라이브러리를 모킹하는 작업이 있음.
        // -> 실제로 페이지가 이동하는지 확인할 수 있기 때문에 실제 앱의 동작과 완전히 동일하게 검증
        cy.url().should('eq', `${Cypress.env('baseUrl')}/register`);
    });
    ```