import * as functions from 'firebase-functions';
import { smsOnNewCommit, smsOnNewCommitOptions } from './smsOnNewCommit'; 

// Define the Cloud Function
export const smsOnNewCommitCF = functions.https.onRequest(async (req, res) => {
  try {
    // Extract user, repo, and mobiles from the request query parameters
    const user = req.query.user as string;
    const repo = req.query.repo as string;
    const mobiles = Array.isArray(req.query.mobiles)
      ? req.query.mobiles as string[]
      : [req.query.mobiles as string];

    // Check if any of the required parameters are missing
    if (!user || !repo || !mobiles) {
      res.status(400).send('Bad request. Missing user, repo, or mobiles parameter.');
      return;
    }

    // Create an options object
    const options: smsOnNewCommitOptions = {
      user,
      repo,
      mobiles
    };

    // Call your existing function (smsOnNewCommit) with the provided options
    await smsOnNewCommit(options);

    // Send a success response
    res.status(200).send('SMS notifications sent successfully.');
  } catch (error) {
    console.error(error);
    // Send an error response
    res.status(500).send('Error processing request.');
  }
});
