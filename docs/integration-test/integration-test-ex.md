# 🧪 통합 테스트 작성하기

## ProductFilter 테스트 요약

### ✅ 테스트 준비
- **스토어 모킹**: 컴포넌트의 초기 필터 정보를 갱신하기 위해 `filter` 스토어를 모킹.
- **API 호출 모킹**: `msw`를 사용하여 카테고리 필드 데이터를 제공하는 API를 모킹.
- **테스트 환경 구성**: `beforeEach`에서 스토어 모킹 및 초기화.


### ✅ 핵심 테스트 기능
1️⃣ **카테고리 렌더링 확인**
- **테스트 목적**: API 호출 후, 카테고리 목록이 정상적으로 렌더링되는지 확인.
- **사용 API**: `screen.findByLabelText`
- **테스트 코드**:
    ```js
    expect(await screen.findByLabelText('category1')).toBeInTheDocument();
    ```

2️⃣ **스토어 액션 호출 확인**
- **상품명 수정 테스트**
    - **테스트 목적**: 상품명 입력 시 setTitle 액션이 호출되는지 확인.
    - **사용 API**: screen.getByLabelText, user.type
    - **테스트 코드**:
        ```javascript
        const textInput = screen.getByLabelText('상품명');
        await user.type(textInput, 'text');
        expect(setTitleFn).toHaveBeenCalledWith('text');
        ```

- **최소/최대 가격 수정 테스트**
    - **테스트 목적**: 최소/최대 가격 입력 시 `setMinPrice`, `setMaxPrice` 액션이 호출되는지 확인.
    - **사용 API**: `screen.getByPlaceholderText`, `user.type`
    - **테스트 코드**: 
        ```javascript
        const minPriceTextInput = screen.getByPlaceholderText('최소 금액');
        await user.type(minPriceTextInput, '1');
        expect(setMinPriceFn).toHaveBeenCalledWith('1');
        ```

3️⃣ **카테고리 선택 테스트**<br>
- **테스트 목적**: 라디오 버튼 클릭 시 선택된 카테고리가 반영되는지 확인.
- **사용 API**: `screen.getByLabelText`, `user.click`, `toBeChecked`
- **테스트 코드**:
    ```javascript
    const category3 = screen.getByLabelText('category3');
    await user.click(category3);
    expect(category3).toBeChecked();
    ```

### ✅ 테스트 주요 기술
- Mocking: mockUseFilterStore를 사용하여 스토어의 액션을 모킹.
- API 모킹: msw로 카테고리 데이터를 제공.
- 핵심 메서드
	- `getByLabelText`: 레이블 텍스트로 요소 찾기.
	- `getByPlaceholderText`: 플레이스홀더 텍스트로 요소 찾기.
	- `findBy~`: 비동기로 렌더링된 요소를 기다린 후 찾기.
	- `toBeChecked()`: 라디오 버튼이나 체크박스가 체크됐는지 확인.

<br>

--- 

<br>

## NavigationBar 테스트 요약

### ✅ 테스트 준비
- **스토어 모킹**:
  - **User 스토어**: 로그인 여부(`isLogin`)와 사용자 정보를 모킹.
  - **Cart 스토어**: 장바구니 데이터(`cart`)를 모킹.
- **API 호출 모킹**: `msw`를 사용하여 `/user` API를 상황에 따라 모킹.
- **동적 API 핸들러 초기화**:
  - `server.use()`를 통해 API 응답을 동적으로 설정.
  - 테스트 간 독립성을 유지하기 위해 `afterEach`에서 `server.resetHandlers()` 호출.


### ✅ 핵심 테스트 기능

1️⃣ **"Wish Mart" 로고 클릭 시 네비게이션**
- **테스트 목적**: 로고 클릭 시 `/` 경로로 이동하는지 확인.
- **사용 API**: `screen.getByText`, `user.click`
- **테스트 코드**:
    ```js
    await user.click(screen.getByText('Wish Mart'));
    expect(navigateFn).toHaveBeenLastCalledWith(1, '/');
    ```

2️⃣ **로그인이 된 경우**

- 장바구니와 로그아웃 버튼 렌더링
	- **테스트 목적**: 로그인 상태에서 장바구니와 사용자 이름 버튼이 표시되는지 확인.
	- **사용 API**: screen.getByTestId, screen.findByRole
	- **테스트 코드**:
        ```javascript
        expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Maria' })).toBeInTheDocument();
        ```
- 장바구니 버튼 클릭 시 네비게이션
	- **테스트 목적**: 장바구니 버튼 클릭 시 /cart로 이동하는지 확인.
	- **테스트 코드**:
        ```javascript
        await user.click(screen.getByTestId('cart-icon'));
        expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
        ```
- 로그아웃 모달 동작
	1.	모달 렌더링 확인
	    - **테스트 목적**: 로그아웃 버튼 클릭 시 모달이 렌더링되는지 확인.
	    - **사용 API**: `screen.getByRole`, `within`
	    - **테스트 코드**:
            ```javascript
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(
            within(screen.getByRole('dialog')).getByText('로그아웃 하시겠습니까?'),
            ).toBeInTheDocument();
            ```
    2. 모달 확인 버튼 동작
	    - **테스트 목적**: 모달의 확인 버튼 클릭 시 로그아웃 처리 및 모달 종료.
	    - **테스트 코드**:
            ```javascript
            await userEvent.click(screen.getByRole('button', { name: '확인' }));
            expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            ```
    3.	모달 취소 버튼 동작
	    - **테스트 목적**: 모달의 취소 버튼 클릭 시 모달 종료.
	    - **테스트 코드**:
            ```javascript
            await userEvent.click(screen.getByRole('button', { name: '취소' }));
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();           
            ```

3️⃣ **로그인이 안된 경우**
- **테스트 목적**: 로그인 버튼 렌더링 및 클릭 시 /login 경로로 이동.
- **사용 API**: `screen.getByRole`, `user.click`
- **테스트 코드**:
    ```javascript
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '로그인' }));
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login', {
    state: { prevPath: 'pathname' },
    });
    ```

### ✅ 테스트 주요 기술
- Mocking:
    > `mockUseUserStore`, `mockUseCartStore`를 사용해 사용자와 장바구니 데이터를 모킹.
- msw:
    > `/user` API 응답을 `server.use()`로 동적으로 설정.
    > 테스트 간 초기화를 위해 `server.resetHandlers()` 사용.
- 쿼리 메서드:
	> getByTestId, getByText, findByRole 등 다양한 쿼리로 요소 조회.
- React Router Mocking:
    > react-router-dom의 useNavigate, useLocation을 모킹하여 네비게이션 동작 테스트.