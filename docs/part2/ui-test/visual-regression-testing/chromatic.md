# 📌 시각적 회귀 테스트(VRT)와 Chromatic  

> 코드 변경으로 인해 UI가 의도치 않게 깨지는 것을 방지하려면 **전문적인 시각적 회귀 테스트 도구를 사용**하는 것이 좋다.  
> 특히 **Chromatic**은 Storybook과 연동이 간편하여 **스토리가 존재한다면 쉽게 UI 변화를 추적**할 수 있다.  

---

## 🔍 시각적 회귀 테스트를 도구로 수행해야 하는 이유  

✔ **일관된 환경에서 UI 스냅샷을 촬영 가능**  
   → 로컬 환경이 아니라 **클라우드에서 동일한 설정으로 테스트 가능**  

✔ **고도화된 비교 알고리즘 사용**  
   → 단순 픽셀 비교가 아니라, **사용자 관점에서 변경 사항을 감지**  

✔ **다양한 브라우저 & 운영 체제에서 테스트 가능**  
   → **크로스 브라우징 검증**을 손쉽게 수행  

✔ **변경 이력을 저장하여 히스토리 관리 가능**  
   → 과거 UI와 비교하며 **어떤 변경이 있었는지 추적 가능**  

---

## 🚀 Chromatic이란?  
> **스토리북(Storybook) 메인테이너들이 개발한 시각적 회귀 테스트 도구**  
> Storybook을 활용한 UI 테스트에 최적화되어 있음  

✔ **스토리북과 연동이 편리**  
   - Storybook을 사용하고 있다면, 추가 설정 없이 바로 적용 가능  

✔ **자동으로 UI 변경 감지**  
   - 코드 변경 시, **기존 UI와 비교하여 달라진 부분을 하이라이트**  

✔ **협업에 최적화된 UI 승인 프로세스 제공**  
   - UI 변경 사항을 팀원들과 함께 리뷰하고 승인할 수 있음  

---
## 🛠 Chromatic을 활용한 시각적 회귀 테스트 워크플로우  

### **1️⃣ 스토리북 작성**
- Storybook을 **CSF(Component Story Format) 형태로 작성**  
- `default export` → 메타데이터 정의 (타이틀, 컴포넌트, 설정 정보)  
- `named export` → 개별 시나리오 스토리 정의  

```javascript
import Button from '@/components/Button';

export default {
  title: '컴포넌트/Button',
  component: Button,
};

export const Default = () => <Button label="클릭" />;
export const Disabled = () => <Button label="클릭" disabled />;
```

### 2️⃣ Chromatic CI 연동
- Chromatic을 CI/CD에 연결하여 자동화
- .github/workflows/chromatic.yml 파일 생성

```js
name: 'Chromatic Deployment'
on: push

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2
      - name: Install Dependencies
        run: npm install
      - name: Publish to Chromatic
        run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

✔ GitHub Secrets에 CHROMATIC_PROJECT_TOKEN 추가 필요<br/>
✔ Turbosnap(`onlyChanged`)을 사용하면 변경된 부분만 테스트 가능<br/>

### 3️⃣ UI 회귀 테스트 실행
- 변경 사항이 발생하면 Chromatic에서 UI 비교
- PR(풀 리퀘스트) 하단에서 변경된 UI 확인 가능

✔ PR에서 UI 변경 감지<br/>
✔ 개별 변경점을 확인 후 승인 또는 수정 가능<br/>

### 4️⃣ PR 승인 및 머지
- 변경된 UI가 정상적이면 PR을 승인하고 머지
- 팀원들이 Chromatic에서 변경 내역을 리뷰 후 승인 가능

✔ UI 변경점 확인<br/>
✔ 작성자가 직접 승인 여부 결정<br/>
✔ 수정이 필요한 경우 PR 수정 후 재확인<br/>

### 5️⃣ 스토리북 배포
- Chromatic이 최신 Storybook을 클라우드에 배포
- 별도 환경 구성 없이 팀원들이 최신 UI 상태를 확인 가능

✔ Manage > Collaborate > PERMALINKS에서 브랜치별 스토리북 링크 제공<br/>
✔ 배포된 스토리북을 통해 UI 테스트 가능<br/>

---

## 🚀 Chromatic 워크플로우의 장점

✅ 자동화된 UI 테스트로 예상치 못한 변경을 빠르게 감지 가능<br/>
✅ 협업이 용이하며 팀원들이 스토리를 보고 빠르게 변경점 확인 가능<br/>
✅ CI/CD에 연동하여 변경 사항을 자동으로 검출하고 승인 가능<br/>
✅ 스토리북과 연동하여 별도의 환경 구성 없이 최신 UI 상태 확인 가능<br/>

<br/>

**💡 스토리북을 이미 사용하고 있다면, Chromatic을 활용하면 UI 테스트를 보다 체계적으로 관리 가능! 🚀🔥**