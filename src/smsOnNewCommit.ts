import { getLatestCommit } from './getCurrentCommit';
import { sendSMS } from './sendSms';
import admin from 'firebase-admin';

export interface smsOnNewCommitOptions {
  user: string;
  repo: string;
  mobiles: string[];
}

// Function to initialize Firebase Admin SDK
async function initializeFirebase() {
  const serviceAccountPath: string = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_FILE || '';
  if (!serviceAccountPath) {
    throw new Error('Firebase service account not set, most likely in Development environment');
  }

  const serviceAccount = await import(serviceAccountPath);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default),
    });
  }
}

// Main function to handle new commit SMS notifications
export const smsOnNewCommit = async (options: smsOnNewCommitOptions): Promise<void> => {
  await initializeFirebase();

  const { user, repo, mobiles } = options;
  
  // Get the latest commit SHA from GitHub
  const latestCommitSha = await getLatestCommit(user, repo);

  // Check Firestore for the latest commit for this user/repo
  const firestore = admin.firestore();
  const docRef = firestore.collection('commits').doc(`${user}-${repo}`);
  const doc = await docRef.get();

  let storedCommitSha = '';
  if (doc.exists) {
    const docData = doc.data();
    if (docData && 'commitSha' in docData) {
      storedCommitSha = docData.commitSha || '';
    }
  }

  // Compare and send SMS if the commit SHA is new
  if (latestCommitSha !== storedCommitSha) {
    await sendSMS({
      to: mobiles,
      body: `New commit in ${repo}: ${latestCommitSha}`
    });

    // Update Firestore with the new commit SHA
    await docRef.set({ commitSha: latestCommitSha });
  }
};

