import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});


describe('', () => {
  beforeEach(() => {
    // 타이머 모킹 -> 0.3초 흐른것으로 타이머 조작 -> spy 함수 호출 확인
    vi.useFakeTimers();

    // 원하는 시간 정의 가능
    // 테스트 당시의 시간에 의존하는 테스트의 경우 시간을 고정하지 않으면 테스트가 깨질 수 있다.
    // -> setSystemTime으로 시간을 고정하면 일관된 환경에서 테스트가 가능해진다.
    vi.setSystemTime(new Date('2023-12-25'));
  });
  
  // teardown에서 타이머 모킹 초기화 -> 다른 테스트에 영향을 주지 않기 위해
  afterEach(() => {
    vi.useRealTimers();
  });

  it('특정 시간이 지난 후 함수가 호출된다.', () => {
    const spy = vi.fn();
  
    const debouncedFn = debounce(spy, 300);
  
    debouncedFn();
  
    // expect(spy).toHaveBeenCalled(); -> Error
    // 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행
    // -> 비동기 함수가 실행되기 전에 단언이 실행됨.
    // -> solution : 타이머 모킹

    // advanceTimersByTime: 시간이 흐른 것 처럼 제어 가능
    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalled();
  });
  
  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.', () => {
    const spy = vi.fn();
  
    const debouncedFn = debounce(spy, 300);
  
    // 최초 호출 후 0.2초 후 호출
    vi.advanceTimersByTime(200);
    debouncedFn();

    // 두 번째 호출 후 0.1초 후 호출
    vi.advanceTimersByTime(100);
    debouncedFn();

    // 세 번째 호출 후 0.2초 후 호출
    vi.advanceTimersByTime(200);
    debouncedFn();

    // 네 번쨰 호출 후 0.3초 후 호출
    vi.advanceTimersByTime(300);
    debouncedFn();

    // 다섯번을 호출했지만 실제 spy 함수는 단 한 번만 호출되어야 함.
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
