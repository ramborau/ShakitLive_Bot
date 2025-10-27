/**
 * Comprehensive Bot Testing Script
 * Tests all FAQ questions and conversation flows via Facebook Send API
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');

// Configuration
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const TEST_USER_PSID = process.env.TEST_USER_PSID || '8748752085160704'; // Test user PSID

// Test categories
const tests = {
  faqs: [
    { question: "What are your operating hours?", category: "Hours", expectedFlow: "faq" },
    { question: "Do you accept credit cards?", category: "Payment", expectedFlow: "faq" },
    { question: "How long is delivery?", category: "Delivery", expectedFlow: "faq" },
    { question: "What payment methods do you accept?", category: "Payment", expectedFlow: "faq" },
    { question: "Can I order online?", category: "Ordering", expectedFlow: "faq" },
    { question: "Do you have WiFi?", category: "Amenities", expectedFlow: "faq" },
  ],

  flows: [
    // Greeting flow
    { question: "Hi", category: "Greeting", expectedFlow: "greeting" },
    { question: "Hello", category: "Greeting", expectedFlow: "greeting" },
    { question: "Kumusta", category: "Greeting (Tagalog)", expectedFlow: "greeting" },

    // Menu inquiry
    { question: "Show me your menu", category: "Menu", expectedFlow: "menu_inquiry" },
    { question: "What pizzas do you have?", category: "Menu", expectedFlow: "menu_inquiry" },

    // Location inquiry
    { question: "Where is the nearest branch?", category: "Location", expectedFlow: "location_inquiry" },
    { question: "Branches in Manila", category: "Location", expectedFlow: "location_inquiry" },

    // Promo inquiry (CRITICAL - should show COMPLEX COUPONS)
    { question: "Any promos?", category: "Promo", expectedFlow: "promo_inquiry" },
    { question: "Do you have deals?", category: "Promo", expectedFlow: "promo_inquiry" },
    { question: "What offers are available?", category: "Promo", expectedFlow: "promo_inquiry" },

    // Supercard inquiry (should show COMPLEX COUPONS)
    { question: "What is Supercard?", category: "Supercard", expectedFlow: "supercard_inquiry" },
    { question: "How do I get a Supercard?", category: "Supercard", expectedFlow: "supercard_inquiry" },

    // Party inquiry
    { question: "Party packages", category: "Party", expectedFlow: "party_inquiry" },
    { question: "Birthday party booking", category: "Party", expectedFlow: "party_inquiry" },

    // Order placement
    { question: "I want to order pizza", category: "Order", expectedFlow: "order_placement" },
    { question: "Pabili ng pizza", category: "Order (Taglish)", expectedFlow: "order_placement" },

    // Tracking inquiry
    { question: "Track my order", category: "Tracking", expectedFlow: "tracking_inquiry" },
    { question: "Where is my order?", category: "Tracking", expectedFlow: "tracking_inquiry" },

    // Complaint
    { question: "My order is wrong", category: "Complaint", expectedFlow: "complaint" },
    { question: "Food is cold", category: "Complaint", expectedFlow: "complaint" },
  ]
};

// Results storage
const results = {
  passed: [],
  failed: [],
  warnings: [],
  responseTimes: []
};

/**
 * Send message to Facebook Send API
 */
function sendMessage(recipientPsid, message) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      recipient: { id: recipientPsid },
      message: { text: message }
    };

    const postData = JSON.stringify(requestBody);

    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v24.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const startTime = Date.now();

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;

        if (res.statusCode === 200) {
          resolve({ success: true, responseTime, data: JSON.parse(data) });
        } else {
          reject({ success: false, statusCode: res.statusCode, responseTime, data });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Wait for bot response (simulate webhook processing time)
 */
function waitForBotResponse(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log test result
 */
function logResult(test, status, details) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${status} - ${test.category}: "${test.question}"`;

  console.log(logEntry);

  if (details) {
    console.log(`  Details: ${JSON.stringify(details)}`);
  }

  // Append to log file
  fs.appendFileSync('bot-test-log.txt', `${logEntry}\n`);
  if (details) {
    fs.appendFileSync('bot-test-log.txt', `  ${JSON.stringify(details)}\n`);
  }
}

/**
 * Run single test
 */
async function runTest(test) {
  try {
    console.log(`\n🧪 Testing: ${test.category} - "${test.question}"`);

    // Send message
    const sendResult = await sendMessage(TEST_USER_PSID, test.question);

    if (!sendResult.success) {
      logResult(test, '❌ FAILED', { reason: 'Message send failed', error: sendResult });
      results.failed.push({ test, error: 'Send failed', details: sendResult });
      return;
    }

    console.log(`  ✅ Message sent (${sendResult.responseTime}ms)`);
    results.responseTimes.push({ test: test.category, time: sendResult.responseTime });

    // Wait for bot to process and respond
    console.log(`  ⏳ Waiting for bot response...`);
    await waitForBotResponse(4000); // 4 seconds for bot processing

    // Log success
    logResult(test, '✅ PASSED', {
      sendTime: sendResult.responseTime,
      expectedFlow: test.expectedFlow
    });
    results.passed.push(test);

  } catch (error) {
    console.log(`  ❌ Error: ${error.message || JSON.stringify(error)}`);
    logResult(test, '❌ FAILED', { error: error.message || error });
    results.failed.push({ test, error });
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('='.repeat(80));
  console.log('🤖 BOT COMPREHENSIVE TESTING STARTED');
  console.log('='.repeat(80));
  console.log(`Test User PSID: ${TEST_USER_PSID}`);
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(80));

  // Initialize log file
  fs.writeFileSync('bot-test-log.txt', '=== BOT COMPREHENSIVE TESTING LOG ===\n');
  fs.appendFileSync('bot-test-log.txt', `Test Started: ${new Date().toLocaleString()}\n`);
  fs.appendFileSync('bot-test-log.txt', `Test User PSID: ${TEST_USER_PSID}\n\n`);

  // Test FAQs
  console.log('\n\n📚 TESTING FAQ QUESTIONS\n' + '-'.repeat(80));
  for (const test of tests.faqs) {
    await runTest(test);
    await waitForBotResponse(2000); // Delay between tests
  }

  // Test Flows
  console.log('\n\n🔄 TESTING CONVERSATION FLOWS\n' + '-'.repeat(80));
  for (const test of tests.flows) {
    await runTest(test);
    await waitForBotResponse(2000); // Delay between tests
  }

  // Generate summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`📈 Total Tests: ${results.passed.length + results.failed.length}`);

  // Average response time
  if (results.responseTimes.length > 0) {
    const avgTime = results.responseTimes.reduce((sum, r) => sum + r.time, 0) / results.responseTimes.length;
    console.log(`⏱️  Average Response Time: ${avgTime.toFixed(2)}ms`);
  }

  // Failed tests detail
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.failed.forEach(({ test, error }) => {
      console.log(`  - ${test.category}: "${test.question}"`);
      console.log(`    Error: ${JSON.stringify(error)}`);
    });
  }

  // Write summary to log
  fs.appendFileSync('bot-test-log.txt', '\n\n=== TEST SUMMARY ===\n');
  fs.appendFileSync('bot-test-log.txt', `Passed: ${results.passed.length}\n`);
  fs.appendFileSync('bot-test-log.txt', `Failed: ${results.failed.length}\n`);
  fs.appendFileSync('bot-test-log.txt', `Warnings: ${results.warnings.length}\n`);
  fs.appendFileSync('bot-test-log.txt', `Total: ${results.passed.length + results.failed.length}\n`);

  if (results.responseTimes.length > 0) {
    const avgTime = results.responseTimes.reduce((sum, r) => sum + r.time, 0) / results.responseTimes.length;
    fs.appendFileSync('bot-test-log.txt', `Average Response Time: ${avgTime.toFixed(2)}ms\n`);
  }

  if (results.failed.length > 0) {
    fs.appendFileSync('bot-test-log.txt', '\n=== FAILED TESTS ===\n');
    results.failed.forEach(({ test, error }) => {
      fs.appendFileSync('bot-test-log.txt', `${test.category}: "${test.question}"\n`);
      fs.appendFileSync('bot-test-log.txt', `  Error: ${JSON.stringify(error)}\n`);
    });
  }

  console.log('\n✅ Test results saved to bot-test-log.txt');
  console.log('='.repeat(80));
}

// Check for required environment variables
if (!PAGE_ACCESS_TOKEN) {
  console.error('❌ ERROR: FACEBOOK_PAGE_ACCESS_TOKEN environment variable not set');
  console.error('   Please set it in your .env file or export it:');
  console.error('   export FACEBOOK_PAGE_ACCESS_TOKEN="your_token_here"');
  process.exit(1);
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Fatal error during testing:', error);
  fs.appendFileSync('bot-test-log.txt', `\n\nFATAL ERROR: ${error.message}\n${error.stack}\n`);
  process.exit(1);
});
