# DearObjet - 소품샵 관리 웹 플랫폼

> 소품샵과 작가를 연결해 입점 계약과 클래스 예약을 관리하는 웹 플랫폼

---

## 📖 목차 (Table of Contents)
- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기 (Getting Started)](#-시작하기-getting-started)
- [사용법 (Usage)](#-사용법-usage)
- [기여하기 (Contributing)](#-기여하기-contributing)
- [라이선스 (License)](#-라이선스-license)

---

## 🚀 프로젝트 소개
소품샵과 작가를 연결하는 플랫폼입니다. 일반회원, 소품샵, 작가 세 가지 회원 유형이 있고, 소품샵은 클래스를 운영하고 작가와 입점 계약을 맺을 수 있습니다. 대학 졸업 필수 과목인 '미디어프로젝트'로 진행한 팀 프로젝트입니다.

이후 프로젝트가 중단되어 백엔드 코드가 사라졌고, 프론트엔드에서 MSW(Mock Service Worker)로 API를 대신해 백엔드 없이도 화면이 동작하도록 데모를 복원하고 있습니다.

- **개발 기간**: 2025.09 ~ 2026.05
- **참여 인원**: 디자이너 1명, 프론트엔드 2명, 백엔드 3명
- **담당 역할**: 프론트엔드 (회원가입, 클래스 등록·관리, 결제관리, 입점관리, 개인정보, 메인 화면, 공지사항 등)

---

## ✨ 주요 기능
- [x] 회원가입 (일반회원, 소품샵, 작가), 휴대폰 인증, 사업자등록증 업로드
- [x] 메인 페이지 (캐러셀, 포스트, 공지사항, 지역 축제 소식)
- [x] 공지사항 (필터링, 페이지네이션)
- [x] 작가 목록 (무한 스크롤), 소품샵의 입점 제안 후 채팅방 이동
- [x] 일반회원 마이페이지 (내 정보 수정, 프로필 사진 변경, 예약 조회)
- [x] 소품샵 클래스 등록·수정·삭제, 예약 관리 (달력 필터, 확정/반려)
- [x] 계약서 관리, 입점처 관리 (계약 상태 변경, PDF 다운로드)
- [ ] 결제·정산 고도화, 반응형 UI, 관리자 페이지 (개선 예정)

---

## 🛠 기술 스택
- **Frontend**: `React 19`, `TypeScript`, `Redux Toolkit`, `Tailwind CSS`, `React Kakao Maps SDK`, `React Calendar`, `Lucide Icons`
- **Tooling**: `Storybook`, `ESLint`, `Prettier`
- **Mocking**: `MSW (Mock Service Worker)`
- **Backend (팀 담당)**: `Spring Boot`, `PostgreSQL`
- **Deployment**: `GitHub Pages` (예정)

---

## 🏁 시작하기 (Getting Started)

### 사전 요구사항 (Prerequisites)
- Node.js v20.19 이상
- npm

### 설치 및 실행 (Installation)
1. 저장소 복제
   ```bash
   git clone https://github.com/n-guswjd/DearObjet.git
   cd DearObjet
   ```
2. 패키지 설치 및 실행
   ```bash
   npm install
   npm run dev
   ```

---

## 💡 사용법 (Usage)
백엔드 없이 MSW로 동작하는 데모입니다. 로그인 화면에서 일반회원, 소품샵, 작가 중 역할을 선택해 들어가면 각 역할의 화면을 둘러볼 수 있습니다.

- 데모 링크: [링크 준비중]

---

## 🤝 기여하기 (Contributing)
포트폴리오 목적으로 공개한 저장소로, 외부 기여는 받지 않습니다.

---

## 📄 라이선스 (License)
별도의 라이선스를 지정하지 않았습니다.
