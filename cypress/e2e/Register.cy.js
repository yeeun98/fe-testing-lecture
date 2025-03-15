beforeEach(() => {
  cy.visit('/register');
});

const submitAndCheckMsg = (text) => {
  cy.findByText('가입').click();

  cy.findByText(text).should('exist');
}

it('이름을 입력하지 않고 가입 버튼을 누를 경우 "이름을 입력하세요" 경고 메세지가 노출된다', () => {
  /**
   * Cypress에서 .type('')이 작동하지 않는 이유

    Cypress의 .type() 명령어는 다음과 같은 특징을 가집니다:

    ✅ .type()은 기본적으로 빈 문자열을 입력하지 않습니다.
    ✅ .clear() 명령어가 이미 존재하기 때문에 Cypress는 빈 문자열을 입력하는 대신 .clear()를 사용하는 것이 더 명확하다고 판단합니다.
   */
  // cy.findByLabelText('이름').type('');
  cy.findByLabelText('이름').clear();
  submitAndCheckMsg('이름을 입력하세요');
});

it('이메일을 입력하지 않고 가입 버튼을 누를 경우 "이메일을 입력하세요" 경고 메세지가 노출된다', () => {
  cy.findByLabelText('이메일').clear();
  submitAndCheckMsg('이메일을 입력하세요');
});

it('잘못된 양식의 이메일을 입력한 후 가입 버튼을 클릭하면 "이메일 양식이 올바르지 않습니다" 경고 메세지가 노출된다', () => {
  cy.findByLabelText('이메일').type('email.com');
  submitAndCheckMsg('이메일 양식이 올바르지 않습니다');
});

it('비밀번호를 입력하지 않고 가입 버튼을 클릭할 경우 "비밀번호를 입력하세요" 경고 메세지가 노출된다', () => {
  cy.findByLabelText('비밀번호').clear();
  submitAndCheckMsg('비밀번호를 입력하세요');
});

it('성공적으로 회원 가입이 완료되었을 경우 "가입 성공!"문구가 노출되며 로그인 페이지로 이동한다', () => {
  // 회원 삭제 불가
  // -> 회원 데이터가 계속 쌓이고, E2E 테스트에서도 중복되지 않는 계정 정보로 업데이트 필요
  // -> 이슈 해결을 위해 등록 API를 스터빙하여 테스트 진행

  // stubbing: 특정 네트워크 요청에 대해 미리 정해진 응답을 반환하는 것
  // intercept: API는 요청과 응답에 대한 호출도 기록 -> stubbing과 spying을 모두 실행할 수 있음
  cy.intercept('POST', 'http://localhost:3000/users', { statusCode: 200 });

  cy.findByLabelText('이름').type('joker');
  cy.findByLabelText('이메일').type('joker@email.com');
  cy.findByLabelText('비밀번호').type('password123');

  submitAndCheckMsg('가입 성공!');
  cy.visit('/');
});

it('회원 가입이 실패했을 경우 "잠시 문제가 발생했습니다! 다시 시도해 주세요." 문구가 노출된다', () => {
  cy.intercept('POST', 'http://localhost:3000/users', { statusCode: 401 });

  cy.findByLabelText('이름').type('joker');
  cy.findByLabelText('이메일').type('joker@email.com');
  cy.findByLabelText('비밀번호').type('password123');

  submitAndCheckMsg('잠시 문제가 발생했습니다! 다시 시도해 주세요.');
});
