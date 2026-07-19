# AI Native Healthcare 웹 출판 가이드

## 가장 간단한 공개 방법: Netlify Drop

1. 이 폴더 전체를 하나의 ZIP으로 압축합니다.
2. Netlify의 Drop 배포 화면에 ZIP 또는 폴더를 올립니다.
3. 발급된 임시 주소에서 사이트를 확인합니다.
4. 도메인을 연결하려면 Netlify의 Domain management에서 보유 도메인을 추가합니다.

## 글을 수정해 다시 출판하는 방법

1. `admin.html`에서 글을 작성합니다.
2. 상태를 `Published`로 바꿉니다.
3. 상단의 **발행 데이터 내보내기**를 누릅니다.
4. 다운로드된 `published-content.json`을 이 폴더의 같은 파일과 교체합니다.
5. 폴더 전체를 다시 배포합니다.

관리자에서 작성한 Draft, Review, Archived 콘텐츠는 `published-content.json`에 포함되지 않습니다.

## 권장 운영 방식

현재 버전은 별도 서버 없이 작동하는 정적 출판 프로토타입입니다. 관리자 데이터는 브라우저 LocalStorage에 저장되므로 반드시 **전체 JSON 백업**을 정기적으로 내려받으세요.

여러 기기 동기화, 로그인, 서버에서 즉시 Publish, 이미지 스토리지, 자동 배포까지 필요해지는 시점에는 다음 구조로 전환하는 것이 좋습니다.

- Frontend: Next.js
- Database/Auth/Storage: Supabase
- Hosting: Vercel
- CMS: 현재 관리자 UI를 React 기반으로 이전

## 파일 역할

- `index.html`: 공개 사이트
- `admin.html`: 로컬 관리자
- `published-content.json`: 공개 사이트가 읽는 발행 데이터
- `data.js`: 초기 기본 데이터 및 장애 시 fallback
- `DEPLOYMENT.md`: 배포 안내
