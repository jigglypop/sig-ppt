# 멘사코리아 시그 쇼케이스

![대표 이미지](public/images/sigcup.webp)

멘사코리아의 다양한 시그(Special Interest Groups)를 소개하는 인터랙티브 웹 애플리케이션입니다.

## 주요 기능

### 1. 시그 통계 현황
- 전체 시그 수, 활동 멤버 수 등 실시간 통계
- 카테고리별 분포 차트
- 애니메이션 카운터와 인터랙티브 차트

### 2. 시그 갤러리
- 3D 카드 플립 애니메이션
- 실시간 검색 및 카테고리 필터링
- 각 시그의 상세 정보 및 가입 링크

### 3. 시그컵 소개
- 패럴랙스 스크롤 효과
- 파티클 애니메이션
- 시그컵 참가 정보

## 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 기술 스택

- **React** + **TypeScript** - 타입 안정성을 갖춘 모던 웹 애플리케이션
- **Vite** - 빠른 개발 환경 및 최적화된 빌드
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion** - 고성능 애니메이션 라이브러리
- **Recharts** - 데이터 시각화
- **Lucide React** - 모던 아이콘 세트

## 반응형 디자인

모든 디바이스에서 최적화된 경험을 제공합니다:
- 데스크톱 (1920px+)
- 태블릿 (768px - 1919px)
- 모바일 (320px - 767px)

## 디자인 특징

- **글래스모피즘** - 투명도와 블러 효과를 활용한 모던 UI
- **그라디언트** - 다이나믹한 색상 전환
- **3D 변형** - 카드 플립 등 입체적인 인터랙션
- **파티클 효과** - 생동감 있는 배경 애니메이션
- **패럴랙스 스크롤** - 깊이감 있는 스크롤 경험

## 프로젝트 구조

```
sig-showcase/
├── public/
│   └── images/          # 시그 이미지 파일
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── HeroSection.tsx
│   │   ├── StatisticsSection.tsx
│   │   ├── SigGallery.tsx
│   │   ├── SigCard.tsx
│   │   └── SigCupSection.tsx
│   ├── data/           # 시그 데이터
│   │   └── sigs.json
│   ├── types/          # TypeScript 타입 정의
│   │   └── sig.ts
│   ├── utils/          # 유틸리티 함수
│   │   └── statistics.ts
│   ├── App.tsx         # 메인 애플리케이션
│   └── index.css       # 글로벌 스타일
└── package.json
```

## 커스터마이징

### 시그 데이터 추가/수정
`src/data/sigs.json` 파일에서 시그 정보를 관리합니다.

### 색상 테마 변경
`tailwind.config.js`와 `src/index.css`에서 색상 팔레트를 수정할 수 있습니다.

### 애니메이션 조정
`tailwind.config.js`의 `keyframes`와 `animation` 섹션에서 애니메이션을 커스터마이징할 수 있습니다.

## 성능 최적화

- 이미지 지연 로딩
- 컴포넌트 레이지 로딩
- 애니메이션 GPU 가속
- 번들 사이즈 최적화

## 기여하기

새로운 기능이나 개선사항이 있다면 PR을 보내주세요!