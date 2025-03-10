import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', () => {
  const username = 'maria@mail.com';
  const password = '12345';

  cy.visit('/login');

  cy.findByLabelText('이메일').type(username);
  cy.findByLabelText('비밀번호').type(password);
  cy.findByLabelText('로그인').click();

  // 로그인 처리 완료될때까지 기다림
  cy.findByText('Maria');
});

Cypress.Commands.add('logout', () => {
  cy.findByRole('button', { name: 'Maria' }).click();
  cy.findByRole('button', { name: '확인' }).click();
});

Cypress.Commands.add('assertUrl', url => {
  cy.url().should('eq', `${Cypress.env('baseUrl')}${url}`);
});

Cypress.Commands.add('getProductCardByIndex', index => {
  return cy.findAllByTestId('product-card').eq(index);
});

Cypress.Commands.addQuery('getCartButton', () => {
  // cy.now()로 감싸 특정 쿼리를 호출 -> subject를 받아 inner function에서 쿼리(get)를 실행할 수 있음
  const getFn = cy.now('get', `[data-testid="cart-icon"]`);

  // inner function 형태로 반환해야 함
  return subject => {
    // cart-icon testid를 가진 요소를 조회하는 get 쿼리
    // 우리가 원하는 subject를 기준으로 실행함
    const btn = getFn(subject);

    return btn;
  };
});
