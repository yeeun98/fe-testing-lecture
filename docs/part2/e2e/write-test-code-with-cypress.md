# 🧪 Cypress로 첫 번째 E2E 테스트 작성하기

## 📌 단위·통합에서 작성한 테스트를 E2E에서도 작성?
✔ 컴포넌트 일부가 아닌 앱 자체에 대한 기능이 동작하는지 검증<br/>
→ 단위∙통합 테스트는 일부 컴포넌트의 조합을 테스트<br/>
→ 앱이 구동되었을 때도 동일하게 동작해야 안정성이 더욱 높아짐<br/>

✔ 통합 테스트에서 검증한 기능을 파악하는 과정은 비효율적<br/>
→ 워크 플로우가 클수록 파악하는데 많은 시간이 소요됨<br/>

<br/>

## 📌 Cypress의 단언 (Assertions)
- ✔ Cypress는 Chai, Chai-jQuery, Sinon-Chai의 문법을 사용할 수 있도록 확장되어 있음
- ✔ Chai-jQuery → 주로 DOM 객체에 대한 단언
- ✔ Sinon-Chai → 주로 Stub이나 Spy에 대한 단언

[🔗 Cypress Assertions 문서](https://docs.cypress.io/app/references/assertions#Chai)

<br/>

## 📌 자주 쓰이는 Cypress 단언
> 다양한 Cypress 단언은 공식 문서에서 확인 가능

[🔗 Cypress Assertions 문서](https://docs.cypress.io/app/references/assertions)

<br/>

## 🔧 활용한 Cypress 주요 문법
- beforeEach, beforeAll → Setup 단계에서 사용
- cy. prefix → Cypress의 내장 API 사용
- visit() 함수 → 특정 페이지 방문
- Cypress Testing Library → DOM 노드 쿼리 사용
- should() 함수 → Cypress의 단언 (내부적으로 Chai, Chai-jQuery, Sinon-Chai 확장)