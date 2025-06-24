// test-env.js
require('dotenv').config();

try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is undefined');
  }

  const parsed = JSON.parse(raw.replace(/\\n/g, '\n'));
  console.log("✅ Parsed key:", parsed.client_email);
} catch (e) {
  console.error("❌ JSON parsing error:", e);
}
