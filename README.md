# ShakitLive Bot - Facebook Messenger Webhook Chat Application

A modern, full-stack web application built with Next.js 15 that receives Facebook Messenger messages via webhook, enriches them with user data, and displays them in a beautiful chat interface.

## Features

- ✅ **Real-time Message Reception** - Webhook endpoint receives Facebook messages
- ✅ **User Enrichment** - Automatically fetches user profiles (name, avatar) from MessengerPeople API
- ✅ **Message Sending** - Send text and template messages back to users via Sobot API
- ✅ **Auto Token Refresh** - Automatic token regeneration every 18 hours
- ✅ **Modern UI** - Built with ShadCN UI components and Tailwind CSS
- ✅ **Thread Management** - Conversations organized by user threads
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Database Storage** - SQLite database with Prisma ORM

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** SQLite + Prisma
- **UI:** ShadCN UI + Tailwind CSS
- **Styling:** Inter font, Custom theme (#00c307, #075e54)
- **APIs:** Sobot API, MessengerPeople API

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Facebook Page and Webhook setup

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
# Sobot API
SOBOT_APP_ID=your_app_id
SOBOT_APP_KEY=your_app_key
SOBOT_TOKEN=your_token
SOBOT_TOKEN_GENERATED=timestamp
SOBOT_TOKEN_EXPIRY=timestamp
SOBOT_API_URL=https://sg.sobot.io/chat-facebook/api/messenger/send
SOBOT_TOKEN_URL=https://sg.sobot.io/api/get_token

# Facebook
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_VERIFY_TOKEN=your_verify_token

# MessengerPeople API
MESSENGERPEOPLE_CHANNEL_UUID=your_channel_uuid
MESSENGERPEOPLE_BEARER_TOKEN=your_bearer_token
MESSENGERPEOPLE_API_URL=https://api.messengerpeople.dev/channels/facebook-messenger

# Database
DATABASE_URL=file:./dev.db
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── actions/           # Server Actions
│   ├── api/
│   │   ├── webhook/       # Facebook webhook endpoint
│   │   └── token/         # Token management API
│   ├── chat/[threadId]/   # Chat thread page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (thread list)
├── components/
│   ├── ui/                # ShadCN UI components
│   ├── message-list.tsx   # Message display component
│   ├── message-composer.tsx # Message input component
│   └── thread-list.tsx    # Thread list component
├── lib/
│   ├── services/
│   │   ├── token-service.ts         # Auto token refresh
│   │   ├── sobot-service.ts         # Sobot API client
│   │   └── messengerpeople-service.ts # User enrichment
│   ├── db-operations.ts   # Database operations
│   ├── prisma.ts          # Prisma client
│   └── init-services.ts   # Service initialization
└── prisma/
    └── schema.prisma      # Database schema
```

## API Endpoints

### Webhook Endpoint
- **GET** `/api/webhook` - Webhook verification
- **POST** `/api/webhook` - Receive Facebook messages

### Token Management
- **GET** `/api/token/refresh` - Check token status
- **POST** `/api/token/refresh` - Manually refresh token

## Database Schema

- **User** - Facebook users with enriched profile data
- **Thread** - Conversation threads
- **ThreadParticipant** - User-thread relationships
- **Message** - Individual messages
- **TokenLog** - Token generation history

## Key Features Explained

### Token Auto-Refresh
The Sobot API token expires every 24 hours. The app automatically:
1. Checks token expiry before each API call
2. Generates a new token using MD5 signature
3. Updates the `.env` file with new token and expiry
4. Runs a background job every 18 hours to proactively refresh

### User Enrichment
When a message is received:
1. Extract sender SSID from webhook payload
2. Call MessengerPeople API to fetch user profile
3. Store user data (first name, last name, profile picture)
4. Display enriched data in the UI

### Message Flow
1. Facebook sends message → Webhook endpoint
2. Validate payload → Extract message data
3. Enrich user data → Store in database
4. Revalidate page → Display in UI
5. Support agent replies → Sobot API → Facebook

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm run start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio
```

## Environment Variables

All sensitive credentials are stored in `.env`. Never commit this file to git.

**Important:** The `SOBOT_TOKEN_EXPIRY` is automatically updated by the token refresh service.

## Webhook Setup

1. Setup your webhook URL: `https://your-domain.com/api/webhook`
2. Use the `FACEBOOK_VERIFY_TOKEN` from your `.env` file
3. Subscribe to `messages` and `messaging_postbacks` events

## Deployment

1. Deploy to Vercel, Railway, or any Node.js hosting
2. Ensure environment variables are configured
3. Database will be created automatically on first run
4. Point your Facebook webhook to the deployed URL

## License

Private - Not for redistribution

## Support

For issues or questions, contact the development team.
