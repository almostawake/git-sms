# git-sms
A simple GCP app to check a public repo page for new commits and if there is one, send a notification SMS using Twilio.

Roughly:
- get commit number from the page
- check it against last commit in firestore
- if it's different:
    - save the new commit in the firestore
    - send the SMS
