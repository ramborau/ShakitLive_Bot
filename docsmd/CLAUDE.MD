# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Facebook Messenger webhook chat application built with Next.js, React, ShadCN UI, and Node.js. The system receives Facebook messages via webhook, enriches them with user data from MessengerPeople API, stores conversations locally, and displays them in a modern chat interface.

**Target Users:** Support agents and admins who need real-time visibility into Facebook Messenger conversations from 3rd-party chatbots.

## Tech Stack

- **Frontend:** Next.js (SSR), React, ShadCN UI components
- **Backend:** Node.js (Next.js API routes)
- **Database:** SQLite (local storage, designed to be swappable)
- **Styling:** Inter font (16px body), Primary: #00c307, Secondary: #075e54
- **External APIs:**
  - Sobot API (Facebook message sending)
  - MessengerPeople API (user enrichment)

## Architecture

### Core Data Flow
1. Facebook webhook ’ POST to Next.js API route
2. Validate payload ’ Extract sender ID (SSID)
3. Call MessengerPeople API to fetch user details (first name, last name, profile image)
4. Store enriched message in SQLite (user, thread, message tables)
5. UI auto-refreshes/polls to display new messages in real-time

### Key Components
- **Webhook Handler:** Receives and validates Facebook payloads
- **Message Enrichment Service:** Fetches user data from MessengerPeople API
- **Database Layer:** Stores users, threads, messages with schema: `user`, `thread`, `message`, `enrichment_meta`
- **Chat UI:** ShadCN-based messenger interface with thread list and message view

## API Integration Details

### Sobot API (Sending Messages)
- **Endpoint:** `POST https://sg.sobot.io/chat-facebook/api/messenger/send`
- **Token:** Retrieved from `GET https://sg.sobot.io/api/get_token`
- **Token Generation:**
  - Requires: `appid`, `create_time` (10-digit timestamp), `sign`
  - Sign formula: `md5(appid + create_time + app_key)`
  - Token expires in 86400s (24h)
- **Message Payload:**
  ```json
  {
    "messaging_type": "RESPONSE",
    "recipientid": "<from webhook>",
    "pageid": "759563007234526",
    "type": "text",
    "payload": "message content"
  }
  ```
- **Template Support:** Generic templates with buttons/images supported

### MessengerPeople API (User Enrichment)
- **Endpoint:** `GET https://api.messengerpeople.dev/channels/facebook-messenger/{SSID}`
- **Auth:** Bearer token (see API.MD for full token)
- **Returns:** User first name, last name, profile image URL
- **Error Handling:** Gracefully degrade to generic avatar/name on API failure

## Development Setup

**Note:** This project is currently in the planning phase. When implementing:

1. Initialize Next.js project with TypeScript
2. Install ShadCN UI and configure with project colors
3. Set up Prisma with SQLite provider
4. Configure environment variables (use .env.example template)
5. Implement webhook route in `/app/api/webhook/route.ts`
6. Build database schema with migrations
7. Create chat UI components using ShadCN

## Environment Variables

Reference `.env` for required credentials:
- `appid` - Sobot API credential ID
- `app_key` - Sobot API key for signature generation
- `token` - Generated Sobot access token
- `page_id` - Facebook Page ID (759563007234526)
- MessengerPeople Bearer token (in API.MD)

**Security:** Never commit tokens/secrets to git. Keep .env in .gitignore.

## Key Requirements

### Performance Targets
- Message display latency: <1 second (P95)
- Backend processing: <250ms average
- Webhook uptime: 99.95%
- Message ingestion success: >99%

### Data Schema
- **User:** SSID (primary), first_name, last_name, profile_image_url
- **Thread:** thread_id, last_activity, participant_ids
- **Message:** message_id, thread_id, sender_ssid, content, timestamp, enrichment_status
- **Enrichment Meta:** API call status, error logs, fallback flags

### UI/UX Guidelines
- Responsive design (mobile + desktop)
- Dark mode support
- Accessible components (ShadCN defaults)
- Threads sorted by latest activity
- Clear error indicators for failed enrichment
- Auto-refresh or polling for new messages

## Critical Implementation Details

1. **Webhook Validation:** Always validate Facebook payload structure before processing
2. **Concurrent Requests:** Handle multiple simultaneous webhook calls without data corruption
3. **API Timeout Handling:** Set timeouts for MessengerPeople API calls; fallback gracefully
4. **Thread Management:** Group messages by conversation/thread, maintain context
5. **Encryption:** Implement encryption at rest for stored messages (compliance requirement)

## Non-Goals (MVP)
- No AI chatbot/smart-reply features
- No non-Facebook channel integration
- No advanced analytics or CSV exports
- No multi-agent support UI (designed for 1-10 agents)

## References
- MCP.MD contains context7 links for Next.js, ShadCN, React, Prisma, and Gemini API documentation
- MESSAGE.MD has example payloads for text and button templates
- TOKEN.MD explains Sobot token generation process
- BRANDING.MD specifies Inter font, 16px body, colors #00c307/#075e54
