# 실무에 바로 적용하는 프론트엔드 테스트
~~~ plaintext
💡  "실무에 바로 적용하는 프론트엔드 테스트 강의" 내용을 정리한 레포지토리입니다.  
    주요 내용, 실습 코드 및 테스트 관련 개념을 기록했습니다.
~~~

## 목차
- [개요](#개요)
- [테스트 코드의 중요성](#테스트-코드의-중요성)
- [테스트 코드 작성 규칙](#테스트-코드-작성-규칙)
- [단위 테스트란](#단위-테스트란)
- [통합 테스트란](#통합-테스트란)

<br>

## 개요
- **다루는 내용**:
  - 프론트엔드 테스트의 핵심 원리
  - 실무에서 바로 활용 가능한 테스트 구현 방법
  - 다양한 실습 예제 및 시나리오
- **테스트 유형**:
  - 단위 테스트(Unit Testing)
  - 통합 테스트(Integration Testing)
- **테스트 프레임워크**: vitest
- **사용 도구**: Testing Library, MSW 등

<br>

## 테스트 코드의 중요성
- 좋은 설계에 대한 사고를 도와준다.
  > 테스트 코드를 위해 결합도가 작도록 설계함으로써 자동으로 좋은 설계에 대한 사고를 돕게 됨
- 테스트 코드를 기반으로 안정성있게 리팩토링을 할 수 있다.
  > 테스트 중 문제를 쉽게 발견하기위해 작은 범위로 개발을 진행함으로써 문제를 발견하고 수정하기 용이해 안정성있게 리팩토링 할 수 있음
- 좋은 테스트 코드는 애플리케이션의 이해를 돕는 문서가 된다.
  > 테스트 코드를 잘 작성하면 describe만으로 애플리케이션의 구동을 이해하기 용이해짐

<br>

## 테스트 코드 작성 규칙
- 인터페이스를 기준으로 테스트를 작성하기
    > - 내부 구현에 대한 테스트 코드는 강한 의존성 때문에 깨지기 쉽고 유지보수 하기 어렵다.<br>
    > - 인터페이스를 기준으로 캡슐화에 위반되지 않으며 종속성이 없는 테스트를 작성하자 
- 100% 커버리지보다는 의미 있는 테스트인지 고민하기
  > - 커버리지를 쫓다 보면 큰 유지 보수 비용이 발생하며 제대로 된 검증이 되었다는 착각이 들 수 있다.<br>
    > - 의미 있는 테스트란 무엇인지 고민해보자!
- 테스트 코드도 유지 보수의 대상, 가독성을 높이자!
    > - 테스트 하기 전 테스트 하고자 하는 내용을 명확하게 적자<br>
    > - 하나의 테스트에는 가급적 하나의 동작만 검증하자

<br><hr><br>

## 단위 테스트란
> 단일 함수의 결괏값 또는 단일 컴포넌트(클래스)의 상태(UI)나 행위를 검증

### ❕ 단위테스트 코드 작성 시엔
- 상세한 테스트 디스크립션을 통해 가독성을 향상시키자
- 내부 DOM 구조나 로직에 영향을 받지않게 테스팅 라이브러리 API를 통해 적절한 요소를 검증하자
- 컴포넌트의 최종 렌더링 결과물인 DOM 구조가 올바르게 변경되었는지 검증하자

[테스트 환경과 매처(Matcher) 상세 내용 보기](./unit-test/docs/test-environment-and-matchers.md)

<br>

[Setup과 Teardown 상세 내용 보기](./unit-test/docs/setup-and-teardown.md)
