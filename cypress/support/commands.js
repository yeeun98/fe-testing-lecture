import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', () => {
  const username = 'maria@mail.com';
  const password = '12345';

  // 쿠키, local storage, session storage에 있는 정보들을 캐싱
  // 콜백 함수 실행 전 -> 모든 도메인의 쿠키, 로컬 스토리지, 세션 스토리지 초기화
  // 초기화 진행 후 로그인 완료 -> 세션 정보 설정
  // 메인 홈페이지로 이동
  cy.session(username, () => {
    cy.visit('/login');

    cy.findByLabelText('이메일').type(username);
    cy.findByLabelText('비밀번호').type(password);
    cy.findByLabelText('로그인').click();

    // 캐싱하기 전에 로그인 프로세스가 완료되도록 보장하기 위해 추가
    cy.location('pathname').should('eq', '/');
  });

  // 로그인 이후 메인 홈페이지로 이동
  cy.visit('/');
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
  const getFn = cy.now('get', `[data-testid="cart-button"]`);

  return subject => {
    const btn = getFn(subject);

    return btn;
  };
});
