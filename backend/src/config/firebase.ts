
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Check if the app has already been initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    // The private key needs to be properly formatted from the environment variable
    // It's stored with escaped newlines, so we need to replace \\n with actual newlines
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Export Firebase services
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
