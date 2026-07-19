# Mark Han — AI Native Healthcare Publishing CMS

정적 웹 출판 워크플로우가 포함된 프로토타입입니다.

- `admin.html`: 글 작성, 미리보기, Draft/Review/Published/Archived 관리, SEO 설정
- `index.html`: Published 콘텐츠만 표시하는 공개 사이트
- `published-content.json`: 실제 공개 데이터
- `DEPLOYMENT.md`: Netlify/Vercel 배포와 업데이트 방법

관리자에서 저장한 내용은 현재 브라우저 LocalStorage에 보관됩니다. 정기적으로 전체 JSON 백업을 내려받으세요.
