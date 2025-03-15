# 🛠 2부: 테스트 심화 - 시각적 회귀 & E2E 테스트

## 📚 목차
- [📝 개요](#개요)
- [🛠 TDD](#tdd)
- [👩🏻‍💻 UI 테스트](#UI-테스트)
	- [📸 스냅샷 테스트](#스냅샷-테스트)
	- [🎨 시각적 회귀 테스트](#시각적-회귀-테스트)
- [🔗 E2E 테스트](#e2e-테스트)
- [⚙️ CI/CD 환경에서의 테스트 자동화](#cicd-환경에서의-테스트-자동화)

---

## 개요
- **다루는 내용**:
  - 시각적 회귀 테스트 및 E2E 테스트의 개념과 활용
	- Storybook & Chromatic을 이용한 UI 테스트 자동화
	- Cypress를 활용한 엔드투엔드(E2E) 테스트 작성 및 최적화
	- CI/CD 환경에서의 테스트 자동화 적용
- **테스트 유형**:  
  - 시각적 회귀 테스트 (Visual Regression Testing)  
  - 엔드투엔드 테스트 (End-to-End Testing, E2E)  
- **테스트 프레임워크**: `Cypress`, `Playwright`  
- **사용 도구**: Storybook, Chromatic 등

---

## TDD

#### TDD란?
- 개발 코드 작성 전에 **테스트 케이스**를 먼저 작성하고, 기능을 추가하며 리팩토링을 반복하는 개발 방법론  
- **테스트 실패 ➡ 테스트 성공 ➡ 리팩토링** 사이클로 개발 진행  

#### TDD의 장점
✅ 개발 단계에서 **버그를 조기에 발견**하고 수정 가능<br/>
✅ 지속적인 테스트로 **안정적인 코드 유지**<br/>
✅ 테스트를 고민하면서 **자연스럽게 좋은 설계로 이어짐**<br/>
✅ 초기 비용이 있지만, 장기적으로 **유지보수에 효과적**<br/>

#### TDD를 반드시 도입해야 할까?
- 테스트 작성 = TDD는 아님!  
- 현실적인 리소스 문제를 고려해 **중요한 기능의 단위 테스트**나 **E2E 테스트**만 선택적으로 적용할 수도 있음

#### 📌 *자세한 강의 내용은 아래 문서를 참고*
- [테스트 주도 개발(TDD)과 프런트엔드 테스트](./tdd/TDD-Frontend-Testing.md)

---

## UI 테스트
~~~
UI 테스트는 사용자가 웹 애플리케이션을 조작할 때 발생하는 동작을 검증하는 테스트 방식입니다.
주로 버튼 클릭, 입력값 변경, 화면 렌더링, UI 상태 변화 등이 올바르게 작동하는지 확인하는 데 사용됩니다.
~~~

✔ UI가 의도한 대로 렌더링되는지 확인<br/>
✔ 사용자 인터랙션(클릭, 입력 등)이 정상적으로 동작하는지 검증<br/>
✔ 디자인 및 레이아웃 변경 시 예기치 않은 UI 깨짐 방지<br/>

<br/>

### 스냅샷 테스트

~~~
스냅샷 테스트는 UI 컴포넌트의 출력이 변경되지 않았는지 확인하는 테스트 방법입니다.
테스트 실행 시 현재 렌더링된 UI를 스냅샷(정상 상태)과 비교하여 차이가 발생하면 테스트가 실패합니다.
주로 UI 변경이 의도한 것인지 확인하는 용도로 사용됩니다. 🚀
~~~

✔ UI 변경이 없으면 ✅ 통과<br/>
✔ UI 변경이 있으면 ❌ 실패 → 필요 시 스냅샷 업데이트<br/>

💡 `toMatchSnapshot()` 또는 `toMatchInlineSnapshot()`을 사용하여 구현할 수 있습니다.<br/>

#### 📌 *자세한 강의 내용은 아래 문서를 참고*
- [스냅샷 테스트](./ui-test/snap-shot/snap-shot.md)
- [스냅샷 테스트의 한계](./ui-test/snap-shot/snapshot-test-limitations.md)

<br/>

### 시각적 회귀 테스트
~~~
시각적 회귀 테스트(Visual Regression Testing, VRT)는 UI의 시각적 요소가 변경되지 않았는지 확인하는 테스트 방식입니다.
기존 스냅샷 테스트(`toMatchSnapshot()`)는 HTML 구조만 비교하지만, 시각적 회귀 테스트는 실제 렌더링된 UI의 "이미지"를 비교하여 변경 사항을 감지합니다.
~~~

#### 📌 *자세한 강의 내용은 아래 문서를 참고*
- [시각적 회귀 테스트란](./ui-test/visual-regression-testing/what-is-visual-regression-testing.md)
- [스토리북](./ui-test/visual-regression-testing/story-book.md)
- [크로마틱](./ui-test/visual-regression-testing/chromatic.md)
- [스냅샷 테스트](./ui-test/snap-shot/snap-shot.md)
- [스냅샷 테스트의 한계](./ui-test/snap-shot/snapshot-test-limitations.md)

<br/>

### E2E 테스트
~~~
E2E(End-to-End) 테스트는 실제 애플리케이션을 구동하여 **전체 소프트웨어 시스템의 흐름을 검증하는 테스트 방법**이다. 사용자가 애플리케이션을 사용하는 동안 발생할 수 있는 다양한 시나리오가 실제 환경에서 정상적으로 작동하는지를 확인한다.
~~~

#### 📌 *자세한 강의 내용은 아래 문서를 참고*
- [E2E 테스트란?](./e2e/what-is-e2e.md)
- [cypress란?](./e2e/cypress.md)
- [cypress로 E2E 테스트작성하기](./e2e/write-test-code-with-cypress.md)
- [cypress와 쿼리](./e2e/cypress-and-query.md)
- [커스텀 커맨드와 쿼리](./e2e/custom-command-and-query.md)
- [E2E 테스트작성하기: cy.session()과 커스텀 명령어](./e2e/cypress-example-main-page.md)
- [서버 요청 가로채기](./e2e/cypress-interceptor.md)
- [E2E 테스트작성하기: 구매페이지](./e2e/cypress-example-purchase-page.md)