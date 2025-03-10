# 🧪 테스트 주도 개발(TDD)과 프런트엔드 테스트

## 📌 TDD란?
~~~
테스트 주도 개발(Test-Driven Development, TDD)**은 **"테스트를 먼저 작성한 후, 기능을 구현하고 리팩토링하는 개발 방법론"
~~~

### ✅ **TDD의 기본 흐름 (Red → Green → Refactor)**
1. **🔴 실패하는 테스트 작성 (Red)**  
   - 먼저 원하는 기능에 대한 테스트를 작성합니다.  
   - 아직 기능이 구현되지 않았으므로, 당연히 테스트는 실패합니다.  

2. **🟢 테스트를 통과하는 최소한의 코드 작성 (Green)**  
   - 테스트가 통과하도록 최소한의 코드를 작성합니다.  
   - 이때 "최적의 코드"가 아니라 **테스트를 통과할 수 있는 코드만** 작성합니다.  

3. **🛠 리팩토링 (Refactor)**  
   - 기능이 정상적으로 동작하는 것을 확인했으니, 코드를 개선합니다.  
   - 중복 제거, 코드 가독성 향상, 성능 개선 등의 작업을 진행합니다.  

---

## 🔍 **TDD를 적용하기 좋은 경우**
~~~
TDD는 모든 코드에 반드시 적용해야 하는 것은 아니다.
하지만 다음과 같은 경우, TDD를 적용하면 효과적임!
~~~

### **📌 TDD와 단위 테스트**
> **"검증하고자 하는 기능이 명확하고, 범위가 넓지 않은 경우"**  

✔ **공통 컴포넌트, 훅(Hooks) 같은 모듈**은 TDD 적용에 적합<br/>
✔ **함수형 로직, 유틸리티 함수** 등 독립적인 기능은 TDD로 테스트하기 쉬움<br/>
✔ 작은 단위에서 기능을 빠르게 검증하고 안정성을 높일 수 있음<br/>

### **📌 TDD와 통합 테스트**
> **"비즈니스 로직을 검증하고, 여러 요소들이 조합된 로직을 테스트하는 경우"**  

✔ **상태 관리 (Redux, Zustand, Vuex 등)**<br/>
✔ **API 호출 로직 및 데이터 처리**<br/>
✔ **여러 컴포넌트가 함께 동작하는 경우**<br/>
✔ **TDD를 통해 안정적인 리팩토링이 가능함**<br/>

---

## ⚠️ **모든 테스트를 작성할 때 TDD를 적용할 필요는 없다**
~~~
TDD는 효율적인 테스트를 위한 하나의 방법론일 뿐, 반드시 모든 코드에 적용해야 하는 것은 아님 !
~~~

### ✅ **더 중요한 것은 테스트 피드백을 통한 안정성 확보**
- TDD 자체에 얽매이지 않고, **테스트의 목적**을 중심으로 개발해야함  
- 중요한 것은 **개발 단계에서 빠르게 테스트 피드백을 받고 기능의 안정성을 높이는 것**

### ✅ **현실적인 테스트 도입 방법**
- 꼭 **TDD 방식이 아니더라도**, **테스트를 팀 문화로 정착**시키는 것이 더 중요 !!
- 개발 중 **빠른 피드백을 받을 수 있도록 테스트를 적절히 활용하는 것이 핵심**
- 코드의 구조와 특성을 고려하여, **단위 테스트와 통합 테스트를 적절히 병행**해야함
