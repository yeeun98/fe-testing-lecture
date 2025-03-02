# 📸 스냅샷 테스트 정리
~~~
스냅샷 테스트는 UI의 변경 사항을 감지하는 자동화 테스트 방식입니다.  
테스트 실행 시 컴포넌트의 렌더링 결과를 저장하고, 이후 테스트에서 기존 스냅샷과 비교하여 변경이 발생하면 테스트가 실패합니다.  
이는 UI 변경이 의도된 것인지 확인하는 데 유용합니다.
~~~

---

## 📌 스냅샷 테스트의 원리

1. **테스트 실행 시 UI의 렌더링 결과를 스냅샷으로 저장**
2. **이후 실행되는 테스트에서 기존 스냅샷과 비교**
3. **변경 사항이 없으면 ✅ 통과, 변경이 발생하면 ❌ 실패**
4. **의도된 변경이라면 스냅샷을 업데이트하여 반영 가능 (`-u` 옵션 사용)**

> 💡 **스냅샷 테스트는 UI가 의도치 않게 변경되는 것을 방지하는 데 효과적이지만, 불필요한 실패를 줄이기 위해 과도하게 사용하지 않는 것이 좋습니다.**

---

## 🛠 `container`의 역할

```javascript
const { container } = await render(<MyComponent />);
```
- container는 렌더링된 DOM 트리를 담고 있는 요소입니다.
- container.innerHTML을 사용하면 렌더링된 HTML 구조를 문자열로 가져올 수 있음
- 이를 활용해 스냅샷 테스트에서 UI 변경을 감지하는 데 사용 가능

### 예제
```jsx
const { container } = await render(<MyComponent />);
expect(container).toMatchSnapshot();
```

---

## 📌 `toMatchSnapshot()` vs `toMatchInlineSnapshot()`

| 함수명                  | 설명                                           | 스냅샷 저장 방식               |
|------------------------|--------------------------------|----------------------|
| `toMatchSnapshot()`        | 기존 스냅샷 파일(`__snapshots__`)과 비교 | 별도 `.snap` 파일 생성 |
| `toMatchInlineSnapshot()` | 테스트 코드 내부에 스냅샷을 직접 저장       | 코드 내 `expect` 안에 스냅샷 기록 |

### 📍 toMatchSnapshot() 사용 예제
```jsx
it('컴포넌트가 올바르게 렌더링된다.', async () => {
  const { container } = await render(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```
✔ 스냅샷 파일(__snapshots__ 폴더)에 저장된 값과 비교하여 변경 여부를 확인<br/>
✔ 만약 UI가 변경되었다면 테스트가 실패

### 📍 toMatchInlineSnapshot() 사용 예제
```jsx
it('컴포넌트가 올바르게 렌더링된다.', async () => {
  const { container } = await render(<MyComponent />);
  expect(container).toMatchInlineSnapshot(`
    "<div>
       <h1>Hello, World!</h1>
     </div>"
  `);
});
```

✔ 스냅샷을 테스트 코드 내부에 직접 저장<br/>
✔ 별도의 스냅샷 파일 없이 유지보수가 가능<br/>
✔ 코드에서 스냅샷을 바로 확인할 수 있음<br/>

---

## 🚀 스냅샷 업데이트 방법
> 만약 UI 변경이 의도된 것이라면, 스냅샷을 업데이트해야 합니다.

```node
npx vitest -u
```