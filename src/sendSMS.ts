import { Request, Response } from 'express';
import twilio from 'twilio';

// Cloud Function to send SMS
export const sendSms = (req: Request, res: Response) => {
    const { to, body } = req.body;

    // Check if 'to' is an array
    if (!Array.isArray(to)) {
        res.status(400).send('Invalid request: "to" must be an array of phone numbers.');
        return;
    }

    // Fetching Twilio credentials from environment variables
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken: string = process.env.TWILIO_AUTH_TOKEN || '';
    const twilioPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';
    const smsHeader: string = "(Andrew's automation robot)";

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        res.status(500).send('Twilio credentials in env are not properly set.');
        return;
    }

    const client = twilio(accountSid, authToken);

    for (const recipient of to) {
        client.messages
            .create({
                to: recipient,
                from: twilioPhoneNumber,
                body: smsHeader + '\n' + body,
            })
            .then(message => console.log(message.sid))
            .catch(error => {
                console.error(error);
                res.status(500).send(`Twilio call error sending SMS to ${recipient}.`);
                return;
            });
    }

    res.send('SMS sent successfully to all recipients.');
};
