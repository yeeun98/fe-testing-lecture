beforeEach(() => {
  cy.visit('/login');

  // 별칭 선언
  cy.findByLabelText('로그인').as('loginBtn');
});

it('이메일을 입력하지 않고 로그인 버튼을 클릭할 경우 "이메일을 입력하세요" 경고 메세지가 노출된다', () => {
    // cy.findByLabelText('로그인').click();
    //cy.get('button.MuiButton-containedPrimary').click(); // dom 구조에 지나치게 의존적

    // get API -> Cypress에서 지정한 별칭으로 선언한 요소에 접근 가능
    // 체이닝 형태로 테스트 코드 작성 -> 테스트의 과정을 이해하기 쉬움, 코드를 간결하게 작성할 수 있음
    cy.get('@loginBtn').click(); // dom 구조에 지나치게 의존적

  cy.findByText('이메일을 입력하세요').should('exist');
});

it('비밀번호를 입력하지 않고 로그인 버튼을 클릭할 경우 "비밀번호를 입력하세요" 경고 메세지가 노출된다', () => {
  cy.get('@loginBtn').click();

  cy.findByText('비밀번호를 입력하세요').should('exist');
});

it('잘못된 양식의 이메일을 입력한 뒤 로그인 버튼을 클릭할 경우 "이메일 양식이 올바르지 않습니다" 경고 메세지가 노출된다', () => {
  // 1. 이메일 요소 조회 커멘드 실행 -> 완료되어야 type 커멘드로 subject가 넘어가 실행됨
  // 2. type 커멘드로 텍스트 입력
  cy.findByLabelText('이메일').type('wrongemail#mail.com');
  // 아래 처럼 변수에 선언해 사용하는 방식은 허용되지 않음
  // const email = cy.findByLabelText('이메일');
  // email.type('wrongemail#mail.com');

  // 이유
  // 커멘드가 실행될 때 각 subject는 내부적으로 비동기 대기열에서 대기하다가 실행
  // get API나 테스팅 라이브러리의 쿼리 실행이 완료되는 타이밍
  // -> subejct 체이닝 형태로 연속해서 커멘드를 실행 or then() API를 사용
  cy.get('@loginBtn').click();

  // then 내부에서 반환하는 값은 새로운 subject가 되어 다음 커멘드에서 사용
  // 아무것도 반환하지 않을 경우 다음 커멘드에서는 이전 subject를 그대로 사용
  cy.findByLabelText('이메일')
    .then($email => {
      const cls = $email.attr('class');

      // wrap으로 감싸야 다시 cypress 라이브러리 사용 가능
      cy.wrap($email).click();
    }).click();

  cy.findByText('이메일 양식이 올바르지 않습니다').should('exist');
});

it('회원 가입 클릭 시 회원 가입 페이지로 이동한다', () => {
  cy.findByText('회원가입').click();

  cy.assertUrl('/register');
});

it('성공적으로 로그인 되었을 경우 메인 홈 페이지로 이동하며, 사용자 이름 "Maria"와 장바구니 아이콘이 노출된다', () => {
  cy.login();

  cy.assertUrl('/');
  cy.findByText('Maria').should('exist');
  cy.findByTestId('cart-icon').should('exist');
});
