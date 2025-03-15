# 📚 Cypress 강의: API 모킹과 결제 테스트 전략

## 🚀 학습 목표
- **`alias`를 사용해 편리하게 테이블 요소 조회**
- **통합 테스트에서 검증할 수 없었던 구매 성공·실패에 대한 워크플로우까지 검증**
- **결제처럼 외부 앱(PG사)을 사용해 테스트 환경을 만들기 어려운 경우 API 스터빙을 통해 시나리오를 검증**

---

## `alias`를 사용한 테이블 요소 조회
`cy.as()`를 사용하면 복잡한 테이블 구조에서 특정 요소를 편리하게 참조 가능

### 예제: 배송 정보 조회
```javascript
beforeEach(() => {
  cy.findAllByRole('table').eq(0).findAllByRole('row').as('shippingList');
});

it('로그인한 사용자의 이름 "Maria"가 입력되어 있다.', () => {
  cy.get('@shippingList').eq(0).findByRole('textbox').should('have.value', 'Maria');
});
```
✅ `as()`를 사용해 `@shippingList`로 지정하면, 복잡한 테이블 구조에서도 간편하게 특정 요소를 참조할 수 있다.

---

## 결제 시나리오 검증
외부 결제 시스템(PG사)과 같이 테스트 환경을 만들기 어려운 경우, `cy.intercept()`를 통해 API를 스터빙하여 결제 성공/실패 시나리오를 검증할 수 있다.

### 예제: 구매 성공 시
```javascript
it('구매하기 성공시 장바구니는 초기화 되고 메인홈 페이지로 이동하며, "구매 성공!" 메세지가 노출된다', () => {
  cy.intercept('POST', 'http://localhost:3000/purchase', {statusCode: 200});

  cy.get('@shippingList').eq(1).findByPlaceholderText('주소를 입력하세요').type('Seoul, Gwanakgu');
  cy.get('@shippingList').eq(3).findByPlaceholderText('휴대폰 번호를 입력하세요').type('000-1110-1111');

  cy.findByText('구매하기').click();

  cy.assertUrl('/');
  cy.findByText('구매 성공!').should('exist');
  cy.getCartButton().should('have.text', '');
});
```

### 예제: 구매 실패 시
```javascript
it('구매 실패시 "잠시 문제가 발생했습니다! 다시 시도해 주세요."라고 경고 문구가 노출된다', () => {
  cy.intercept('POST', 'http://localhost:3000/purchase', {statusCode: 500});

  cy.get('@shippingList').eq(1).findByPlaceholderText('주소를 입력하세요').type('Seoul, Gwanakgu');
  cy.get('@shippingList').eq(3).findByPlaceholderText('휴대폰 번호를 입력하세요').type('000-1110-1111');

  cy.findByText('구매하기').click();

  cy.findByText('잠시 문제가 발생했습니다! 다시 시도해 주세요.').should('exist');
});
```

✅ `cy.intercept()`를 활용하면 **외부 서비스 없이** 성공/실패 시나리오를 쉽게 검증할 수 있다.

