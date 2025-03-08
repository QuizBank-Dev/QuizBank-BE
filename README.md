# QuizBank

## 스크립트 명령어

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 환경변수

- ENV: `dev || prod` (default: `dev`)
- PORT: `number` (default `3000`)
- DB_DEFAULT_URI: `string` (`required`)
- DB_SUB_URI: `string` (`required`)
- ACCESS_TOKEN_SECRET: `string` (`required`)
- REFRESH_TOKEN_SECRET: `string` (`required`)
- CLIENT_LOCAL_URL: `string` (default: `http://localhost:3000`)
- CLIENT_PROD_URL: `string`
