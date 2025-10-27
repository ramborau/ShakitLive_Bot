# ShakitLive Bot - Usage Guide

## Two-Pane Interface

The application now features a modern two-pane layout:

### Left Pane: Thread List (320px wide)
- Shows all active conversations
- Displays user avatar, name, and last message
- Shows "X time ago" for each conversation
- Highlights selected thread with green left border
- Auto-scrolls if many conversations

### Right Pane: Chat View (Flexible width)
- Shows full conversation with selected user
- Header displays user name, avatar, and SSID
- Messages displayed with timestamps
- Message composer at bottom for sending replies
- Green-tinted message bubbles for easy reading

## Features

### Thread Selection
- Click any thread in the left sidebar to view its messages
- Selected thread is highlighted with a green border
- URL updates with `?threadId=xxx` for direct linking

### Sending Messages
1. Type your message in the input field at the bottom
2. Click the Send button (or press Enter)
3. Message is sent via Sobot API to Facebook Messenger
4. Page auto-refreshes to show your sent message

### Real-time Updates
- When new messages arrive via webhook, they appear immediately
- Thread list updates with latest message preview
- Threads are sorted by most recent activity

## Navigation

- **Home Page**: `http://localhost:3000`
  - Shows two-pane layout with all threads
  - Auto-selects first thread by default

- **Direct Thread Link**: `http://localhost:3000/?threadId={id}`
  - Opens specific conversation directly

- **Legacy Single Thread View**: `http://localhost:3000/chat/{threadId}`
  - Still available for backward compatibility

## Keyboard Shortcuts

- `Enter` - Send message (when input is focused)
- `Esc` - Clear input field

## Layout Responsiveness

- **Desktop** (>1024px): Full two-pane layout
- **Tablet** (768-1024px): Narrower sidebar, responsive chat
- **Mobile** (<768px): Stack layout (future enhancement)

## Color Scheme

- **Primary Green**: #00c307 (Send button, accents, selected border)
- **Secondary Green**: #075e54 (Headers, dark elements)
- **Message Bubbles**: Light green tint (#00c307 at 10% opacity)
- **Background**: Clean white (light mode) / Dark gray (dark mode)

## Current Test Data

You have one test conversation:
- **User**: Rahul Mane
- **Thread ID**: `c8d779e3-fbce-489d-943b-9a9679eac398`
- **Messages**:
  1. "Hello! This is a test message from the webhook."
  2. "Can you help me with my order?"

## Next Steps

1. **Test Sending a Reply**:
   - Open http://localhost:3000
   - The test thread should be visible and selected
   - Type a message and click Send
   - Check your Facebook Messenger to see the sent message

2. **Test Webhook**:
   - Send a message from Facebook Messenger
   - It should appear in the thread list automatically
   - Click to view the full conversation

3. **Deploy to Production**:
   - Deploy to Vercel, Railway, or similar
   - Update Facebook webhook URL to your production domain
   - Ensure environment variables are configured

## Troubleshooting

### Messages not appearing?
- Check webhook endpoint is configured correctly
- Verify Facebook page is connected
- Check server logs for errors

### Can't send messages?
- Verify Sobot token hasn't expired (refreshes every 18 hours automatically)
- Check API credentials in .env file
- Look for errors in browser console

### Layout looks broken?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for CSS errors

## Support

For issues or questions:
1. Check server logs (terminal running `npm run dev`)
2. Check browser console for errors
3. Verify .env file has all required variables
4. Ensure database is properly migrated
