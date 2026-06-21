# API 명세 (MVP, 쉬운 버전)

이 문서는 앱이 서버와 어떻게 대화하는지 정합니다.

## 1) 공통 규칙
- Base URL: `https://<azure-api-domain>`
- 데이터 형식: JSON
- 시간 형식: ISO-8601 (`2026-06-13T10:00:00Z`)
- 공통 에러 형식:

```json
{
  "code": "ERROR_CODE",
  "message": "사용자에게 보여줄 쉬운 설명"
}
```

---

## 2) `POST /auth/login`
이 API는 사용자가 로그인할 때 씁니다.

요청 예시:
```json
{
  "email": "mapmaker@example.com",
  "password": "1234abcd!"
}
```

성공 응답 예시:
```json
{
  "access_token": "token_value",
  "expires_at": "2026-06-13T12:00:00Z",
  "user": {
    "id": "usr_2001",
    "nickname": "지도초보"
  }
}
```

실패 응답 예시:
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "이메일 또는 비밀번호를 확인해 주세요."
}
```

## 3) `POST /places`
이 API는 새 장소를 등록할 때 씁니다.

요청 예시:
```json
{
  "name": "관악산 숨은 전망대",
  "latitude": 37.4451,
  "longitude": 126.9582,
  "level_type": "산",
  "description": "해질 때 뷰가 좋아요."
}
```

성공 응답 예시:
```json
{
  "id": "plc_1001",
  "created_at": "2026-06-13T10:05:00Z"
}
```

실패 응답 예시:
```json
{
  "code": "INVALID_PLACE_DATA",
  "message": "장소 정보를 다시 확인해 주세요."
}
```

## 4) `GET /places`
이 API는 등록된 장소 목록을 가져올 때 씁니다.

요청 예시:
```json
{}
```

성공 응답 예시:
```json
{
  "items": [
    {
      "id": "plc_1001",
      "name": "관악산 숨은 전망대",
      "level_type": "산"
    }
  ]
}
```

실패 응답 예시:
```json
{
  "code": "UNAUTHORIZED",
  "message": "로그인이 필요합니다."
}
```

## 5) `GET /places/{id}`
이 API는 특정 장소 상세 정보를 볼 때 씁니다.

요청 예시:
```json
{}
```

성공 응답 예시:
```json
{
  "id": "plc_1001",
  "name": "관악산 숨은 전망대",
  "latitude": 37.4451,
  "longitude": 126.9582,
  "level_type": "산",
  "description": "해질 때 뷰가 좋아요."
}
```

실패 응답 예시:
```json
{
  "code": "PLACE_NOT_FOUND",
  "message": "해당 장소를 찾을 수 없습니다."
}
```

## 6) `POST /places/{id}/share`
이 API는 장소 공유 링크를 만들 때 씁니다.

요청 예시:
```json
{}
```

성공 응답 예시:
```json
{
  "share_url": "https://new-map.app/share/ab12cd34",
  "expires_at": "2026-06-20T10:00:00Z"
}
```

실패 응답 예시:
```json
{
  "code": "PLACE_NOT_FOUND",
  "message": "공유할 장소를 찾을 수 없습니다."
}
```
