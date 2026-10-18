# yeongdu-election

간단한 투표 프로그램입니다.(구현중)

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 구조

- `src/shared/election.ts`: 후보자·당선자 타입, IPC 채널과 API 계약
- `src/main/data.ts`: Electron에 의존하지 않는 투표 상태와 변경 로직
- `src/main/ipc.ts`: IPC 핸들러 등록과 모든 창에 변경 사항 전달
- `src/main/window.ts`: 화면별 크기와 라우트를 사용하는 공통 창 생성
- `src/preload/index.ts`: 타입이 지정된 `window.api`와 이벤트 구독 해제
- `src/renderer/src/hooks/useElection.ts`: 초기 조회와 실시간 이벤트를 연결하는 React 훅
- `tests`: 투표 상태와 이벤트 구독의 회귀 테스트

후보자 이름을 키로 득표 수를 관리합니다. 후보자 추가는 0표로 등록하며,
공백 이름과 중복 등록은 무시합니다. 투표는 등록된 후보자에게만 반영하고,
득표 수는 0 미만으로 내려가지 않습니다. 당선자 삭제는 기존과 같이 이름 기준입니다.

초기 조회보다 실시간 이벤트가 먼저 도착하면 이벤트 값을 유지합니다.
화면을 닫으면 구독을 해제하고, 이후 도착한 조회 결과도 무시합니다.
투표 상태는 메모리에 보관하므로 앱을 종료하면 초기화됩니다.

결과 화면의 당선자 영역은 하단에 고정되고, 득표 목록만 세로로 스크롤됩니다.
당선자가 많으면 당선자 목록을 가로로 스크롤할 수 있습니다.
결과 창을 열어 둔 뒤 투표 관리 화면에서 표 조절 옆의 **당선 확정** 버튼을 누르고 직위를 확인하면,
열려 있는 결과 창에 이름과 직위를 담은 축하 메시지와 컨페티가 표시됩니다.
아직 당선자로 등록하지 않은 후보자도 이곳에서 직위를 입력해 바로 등록·확정할 수 있습니다.
축하 메시지는 9초 뒤 닫히며, 버튼이나 Escape 키로도 닫을 수 있습니다.
동작 줄이기 설정을 사용하는 환경에서는 컨페티를 생략합니다.
확정 상태는 결과 창을 다시 열어도 유지되지만, 축하 효과는 다시 재생하지 않습니다.

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

### 검증

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

테스트는 TypeScript로 컴파일한 뒤 Node.js의 기본 테스트 러너로 실행합니다.
테스트 출력은 `out/tests`에 생성되며 앱 패키징에서는 제외합니다.
