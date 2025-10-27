# Facebook Messenger API Test Results

**Test Date**: 2025-01-27  
**Page ID**: 759563007234526  
**Test PSID**: 24614877841461856  
**API Version**: v24.0

## Summary

**Total Tests**: 6  
**Successful**: 5 ✅  
**Failed**: 1 ❌  
**Success Rate**: 83.3%

---

## Test Results

### ✅ 1. TEXT Message - **SUCCESS**
**Status**: Delivered  
**Message ID**: `m_yR_QQdyMUg6EvM70FsUfLz_3GH0f1acEW1wOaws2y3_Gz-mV6iS10W6AprnrfBxOcFCpJWv85XUBFlmqsIGbDQ`

**Payload**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "messaging_type": "RESPONSE",
  "message": {"text": "Hello, world! This is a test message from Facebook API."}
}
```

**Notes**: Basic text messages work perfectly. This is the foundation for all bot communication.

---

### ❌ 2. ATTACHMENT Message (Image) - **FAILED**
**Status**: Error  
**Error Code**: #100 (OAuthException)  
**Error Subcode**: 2018047  
**Error Message**: "Upload attachment failure."

**Payload Attempted**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "message": {
    "attachment": {
      "type": "image",
      "payload": {"url": "https://shakeys-app.vercel.app/shakeit.jpg"}
    }
  }
}
```

**Notes**: 
- Tested with both shakeys-app.vercel.app image and GitHub public image
- Both failed with same error code
- Possible causes:
  - Page permissions don't allow image uploads
  - URL not accessible from Facebook servers
  - Need to use attachment upload API first
  - Image URL requires HTTPS with valid SSL

**Recommendation**: Use Attachment Upload API or ensure image URLs are on whitelisted domains

---

### ✅ 3. BUTTON Template - **SUCCESS**
**Status**: Delivered  
**Message ID**: `m_np63yh1nRyDwhLj8ruihSz_3GH0f1acEW1wOaws2y3_8csMnAZqflLyMjq6tDusHxKhf2cPNu2KNpoQp3s5Kqsg`

**Payload**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to do next?",
        "buttons": [{
          "type": "web_url",
          "url": "https://shakeys-app.vercel.app",
          "title": "Visit Website"
        }]
      }
    }
  }
}
```

**Notes**: Button templates work great! Can include web_url and postback buttons. Max 3 buttons per template.

---

### ✅ 4. COUPON Template - **SUCCESS**
**Status**: Delivered  
**Message ID**: `m_QFCP_2Mq2lAEdDzRYppGsj_3GH0f1acEW1wOaws2y3_zUlkIbW5n35bt7m6cdynIyKgJgWmKzIzkzNEAKNMaTA`

**Payload**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "coupon",
        "title": "10% off everything",
        "coupon_code": "10PERCENT"
      }
    }
  }
}
```

**Notes**: Coupon template renders beautifully! Perfect for promotional campaigns.

---

### ✅ 5. GENERIC Template (Carousel) - **SUCCESS**
**Status**: Delivered  
**Message ID**: `m_CZ1PxUFet0QbfOIuHLmlej_3GH0f1acEW1wOaws2y399Fa2yaRq5JsrgEf7zLq649KH9q39BXCwiKKOA_odMNQ`

**Payload**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Welcome to Shakeys!",
          "subtitle": "We have the best pizza for everyone.",
          "buttons": [
            {"type": "web_url", "url": "https://shakeys-app.vercel.app/", "title": "View Menu"},
            {"type": "postback", "title": "Order Now", "payload": "ORDER_NOW"}
          ]
        }]
      }
    }
  }
}
```

**Notes**: Generic template is perfect for product catalogs and carousels. Can include up to 10 elements.

---

### ✅ 6. QUICK REPLIES - **SUCCESS**
**Status**: Delivered  
**Message ID**: `m_o4bEr7K5cEXGFGM4BHQr3T_3GH0f1acEW1wOaws2y39gVnlj0QEwK3huvUehgPfZpAN9BaGo8IjZy9PCTA2m3g`

**Payload**:
```json
{
  "recipient": {"id": "24614877841461856"},
  "messaging_type": "RESPONSE",
  "message": {
    "text": "What would you like to do?",
    "quick_replies": [
      {"content_type": "text", "title": "Order Pizza", "payload": "ORDER_PIZZA"},
      {"content_type": "text", "title": "Track Order", "payload": "TRACK_ORDER"},
      {"content_type": "text", "title": "Get Supercard", "payload": "GET_SUPERCARD"}
    ]
  }
}
```

**Notes**: Quick replies work perfectly! Max 13 quick replies per message. Great for conversational flows.

---

## Message Types NOT Tested

The following message types from FB.MD were **not tested** as requested (ONE TIME configuration):

1. **ICE BREAKERS** - One-time messenger profile setup
2. **COMMANDS** - One-time messenger profile setup  
3. **WELCOME MESSAGE** - One-time messenger profile setup
4. **PERSISTENT MENU** - One-time custom user settings

The following were **skipped** due to complexity or special requirements:

- **REPLY TO** - Requires existing message_id
- **COMPLEX COUPON** - More advanced version of coupon (basic coupon works)
- **CSAT (Customer Satisfaction)** - Complex feedback form template
- **ADDRESS MESSAGES** - Customer information template (Philippines-specific)

---

## Working Message Types for Bot Implementation

### Recommended for Shakeys Bot:

1. ✅ **TEXT** - Basic responses
2. ✅ **BUTTON Template** - Action prompts (web URLs, postbacks)
3. ✅ **COUPON Template** - Promotional offers
4. ✅ **GENERIC Template** - Menu items, product catalog
5. ✅ **QUICK REPLIES** - Conversation flow options

### Needs Investigation:

1. ❌ **ATTACHMENT (Images)** - Need to resolve upload permissions or use different approach

---

## Next Steps

1. Create a Facebook Send Service to replace Sobot API
2. Implement working message types in new service
3. Investigate and fix image attachment issue
4. Set up ONE TIME configurations (ice breakers, persistent menu, etc.)
5. Test postback button handling with webhook

---

**Access Token Used**: `EAASnq7m5LikBPxeB2ZCENL4C0d8M23sZBgi0qZBBDRbd7QQL2rgNwZBSnSmIACD4800SFg4Dpoe8hGqFUKZBYC8omxjoZCS8HtaaJUSXCcn4DXog7PtjrRDYD0eCKJuyb8s7ldm8XWgapS5wXRufRbMQuKpE56LRntM6NwkkeRzTVAGJdPZAczcZAk308D3hEeGwlW2CXwZDZD`

**Test Completed**: 2025-01-27

---

Generated with Claude Code  
https://claude.com/claude-code
