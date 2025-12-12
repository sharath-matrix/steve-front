# STEVE AI Backend (Bolt)
This backend powers Steve AI:
- Chat messages
- Conversation storage
- Snapshot extraction
- Inventory recommendation
- Campaign draft creation
- File uploads

## Install
npm install

## Run
npm start

## Env Vars
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=
APP_URL=
OPENAI_API_KEY= (optional)
PORT=8080

## Endpoints
POST /api/steve/chat
POST /api/steve/extract
POST /api/steve/recommend
POST /api/campaigns/create
POST /api/upload

## Health
GET /health
