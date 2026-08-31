# Name Suggest App

Small static name-suggestion page with a Vercel serverless API that forwards submissions to Telegram.

## Vercel deployment

1. Import this project into Vercel.
2. No framework preset is required. Leave the build command empty/default.
3. Add these Environment Variables in Vercel:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy.

The frontend is served from `/index.html` and the API is automatically exposed at:

`POST /api/submit`

Do not put Telegram credentials in `index.html` or any client-side JavaScript.

## Local development

Copy `.env.example` to `.env`, fill in the Telegram variables, then run:

```bash
npm install
npm run dev
```

The local Express server still serves the same frontend and `/api/submit` route.
