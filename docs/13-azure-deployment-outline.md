# Azure 배포 개요 (MVP)

이 문서는 "어떤 순서로 Azure에 올릴지"를 설명합니다.

## 1) 필요한 Azure 자원
- Resource Group
- App Service (API 서버)
- Azure SQL Database
- Application Insights (선택)

## 2) 배포 순서 (7단계)
1. Resource Group 생성
2. Azure SQL Database 생성
3. API 코드를 App Service에 배포
4. App Service 환경변수 설정(DB 연결 문자열 등)
5. API와 DB 연결 확인
6. Android 앱의 API URL을 Azure 주소로 설정
7. 로그인/등록/조회 기본 동작 점검

## 3) 자주 실패하는 원인 5개
- DB 연결 문자열 오타
- DB 방화벽 규칙 미설정
- App Service 환경변수 누락
- CORS 미설정
- 앱에 입력한 API URL 오입력
