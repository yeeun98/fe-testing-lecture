# Cypress

## 📌 Cypress란?
~~~
Cypress는 실제 웹 애플리케이션을 기준으로 다양한 테스트를 작성할 수 있는 오픈 소스 자동화 도구이다.
~~~

- **End-to-End(E2E) 테스트**, **통합 테스트**, **유닛 테스트**까지 지원
- 브라우저 안과 밖에서 일어나는 상황을 제어할 수 있어 **일관된 환경에서 테스트를 실행 가능**
- JavaScript 기반으로 쉽게 설정하고 실행할 수 있음

---

## 🎯 Head 모드와 Headless 모드
> Cypress는 두 가지 실행 모드를 제공한다.

### ✅ **Head 모드**
- **브라우저 UI를 실행하면서 테스트를 진행**
- 실제 브라우저에서 **테스트 과정을 시각적으로 확인 가능**
- 주로 **디버깅 또는 테스트 실행 과정 확인**할 때 사용됨

#### 📌 실행 방법
```sh
npx cypress open
```

### ✅ Headless 모드
- UI 없이 브라우저 엔진을 명령어 기반으로 제어하여 테스트 실행
- 구동 속도가 빠르고 CI/CD 또는 클라우드 환경에서 사용됨
- UI가 없기 때문에 스크린샷 및 로그를 기반으로 결과 확인

#### 📌 실행 방법
```sh
npx cypress run
```

---

## 🚀 Cypress의 장점

- 🔹 편리하고 빠른 디버깅
  - 개발자 도구(DevTools)와 쉽게 연동되어 디버깅이 용이함
  - 테스트 실행 중 콘솔에서 요청 및 응답을 쉽게 확인 가능

- 🔹 Time Travel과 스크린샷 기능
  - Cypress는 각 테스트의 실행 단계를 기록하고 이전 상태로 돌아갈 수 있는 Time Travel 기능 제공
  - 테스트 중 발생한 오류 화면을 자동으로 캡처하여 저장
  - 테스트 실패 시 스크린샷 및 동영상 자동 저장 가능

### 📌 예제 (실패 시 스크린샷 저장)
```sh
it('로그인 테스트', () => {
  cy.visit('/login');
  cy.get('#username').type('testuser');
  cy.get('#password').type('wrongpassword');
  cy.get('#submit').click();
  cy.screenshot('login-error'); // ❌ 실패 화면 저장
});
```

---

## 🔥 추가 고려사항
- `Cypress`는 기본적으로 브라우저 내에서 실행되기 때문에 다중 탭 테스트는 제한적
- 백그라운드에서 실행되는 API 테스트는 다른 도구와 함께 사용해야 할 수도 있음
- `Cypress` 공식 플러그인 사용 시 기능 확장 가능 (ex: `cypress-real-events`, `cypress-axe` 등)