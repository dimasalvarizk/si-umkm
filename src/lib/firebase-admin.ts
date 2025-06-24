// src/app/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // 🔍 Tambahkan log ini untuk memastikan env terbaca
  console.log({
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey?.slice(0, 40), // cukup cek awal key
  });

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();
