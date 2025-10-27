// Test script to send different message types from MESSAGE.MD
// Using native fetch (Node.js 18+)
require('dotenv').config();

const SOBOT_API_URL = process.env.SOBOT_API_URL || "https://v3.sobot.io/api/v1/msg/send";
const PAGE_ID = "759563007234526";
const RECIPIENT_ID = "24614877841461856"; // Your test user

async function getToken() {
  // Just return the token from environment
  return process.env.SOBOT_TOKEN;
}

// Message Type 1: TEXT
async function sendTextMessage(token) {
  console.log("\n=== Testing TEXT Message ===");
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: RECIPIENT_ID,
    pageid: PAGE_ID,
    type: "text",
    payload: "What do you want to do next?"
  };

  const response = await fetch(SOBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log("Text Message Result:", result);
  return result;
}

// Message Type 2: BUTTONS (Generic Template)
async function sendButtonsMessage(token) {
  console.log("\n=== Testing BUTTONS Message ===");
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: RECIPIENT_ID,
    pageid: PAGE_ID,
    type: "template",
    payload: {
      template_type: "generic",
      elements: [{
        title: "Welcome to Shakey's!",
        image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        subtitle: "We have the best pizza in town!",
        default_action: {
          type: "web_url",
          url: "https://shakeyspizza.ph",
          messenger_extensions: false,
          webview_height_ratio: "tall",
          fallback_url: "https://shakeyspizza.ph"
        },
        buttons: [{
          type: "web_url",
          url: "https://shakeyspizza.ph",
          title: "View Menu"
        }, {
          type: "postback",
          title: "Order Now",
          payload: "START_ORDER"
        }]
      }]
    }
  };

  const response = await fetch(SOBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log("Buttons Message Result:", result);
  return result;
}

// Message Type 3: CAROUSEL (Multiple Cards)
async function sendCarouselMessage(token) {
  console.log("\n=== Testing CAROUSEL Message ===");
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: RECIPIENT_ID,
    pageid: PAGE_ID,
    type: "template",
    payload: {
      template_type: "generic",
      elements: [
        {
          title: "Pepperoni Pizza",
          image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
          subtitle: "Classic pepperoni with mozzarella - ₱369",
          buttons: [{
            type: "postback",
            title: "Add to Cart",
            payload: "product_61"
          }, {
            type: "web_url",
            url: "https://shakeyspizza.ph/menu/pepperoni",
            title: "View Details"
          }]
        },
        {
          title: "Hawaiian Delight",
          image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
          subtitle: "Ham and pineapple perfection - ₱369",
          buttons: [{
            type: "postback",
            title: "Add to Cart",
            payload: "product_42"
          }, {
            type: "web_url",
            url: "https://shakeyspizza.ph/menu/hawaiian",
            title: "View Details"
          }]
        },
        {
          title: "Classic Cheese",
          image_url: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800",
          subtitle: "Simple and delicious - ₱299",
          buttons: [{
            type: "postback",
            title: "Add to Cart",
            payload: "product_20"
          }, {
            type: "web_url",
            url: "https://shakeyspizza.ph/menu/cheese",
            title: "View Details"
          }]
        }
      ]
    }
  };

  const response = await fetch(SOBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log("Carousel Message Result:", result);
  return result;
}

// Message Type 4: TEST MESSAGE (with Quick Replies)
async function sendTestMessage(token) {
  console.log("\n=== Testing TEST Message (with Quick Replies) ===");
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: RECIPIENT_ID,
    pageid: PAGE_ID,
    type: "template",
    payload: {
      template_type: "generic",
      elements: [{
        title: "Welcome to Shakey's!",
        image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
        subtitle: "We have the right pizza for everyone.",
        default_action: {
          type: "web_url",
          url: "https://shakeyspizza.ph",
          webview_height_ratio: "tall"
        },
        buttons: [{
          type: "web_url",
          url: "https://shakeyspizza.ph",
          title: "View Website"
        }, {
          type: "postback",
          title: "Start Chatting",
          payload: "GET_STARTED"
        }]
      }]
    },
    quick_replies: [{
      content_type: "text",
      title: "Search Menu",
      payload: "SEARCH_MENU"
    }, {
      content_type: "location"
    }]
  };

  const response = await fetch(SOBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  console.log("Test Message Result:", result);
  return result;
}

// Main test function
async function runTests() {
  try {
    console.log("Getting authentication token...");
    const token = await getToken();
    console.log("Token obtained successfully");

    // Test each message type
    await sendTextMessage(token);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    await sendButtonsMessage(token);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await sendCarouselMessage(token);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await sendTestMessage(token);

    console.log("\n=== All tests completed! ===");
  } catch (error) {
    console.error("Error running tests:", error);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { sendTextMessage, sendButtonsMessage, sendCarouselMessage, sendTestMessage };
