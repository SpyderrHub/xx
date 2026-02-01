import admin from 'firebase-admin';

let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (!privateKey || !process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      throw new Error('Firebase Admin SDK environment variables are not set.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    
    adminAuth = admin.auth();
    adminDb = admin.firestore();

  } catch (error: any) {
    console.warn('Firebase Admin initialization error:', error.message, 'Admin-dependent features will be disabled.');
  }
} else {
  adminAuth = admin.auth();
  adminDb = admin.firestore();
}

export { adminAuth, adminDb };
