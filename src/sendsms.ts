import express, { Request, Response } from 'express';
import twilio from 'twilio';

const app = express();
app.use(express.json()); // Using express's built-in body parser

// POST endpoint to send SMS
app.post('/send-sms', (req: Request, res: Response) => {
    const { to, body } = req.body;

    // Fetching Twilio credentials from environment variables
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken: string = process.env.TWILIO_AUTH_TOKEN || '';
    const twilioPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';
    
    const smsHeader: string = "(Andrew Walker's automation bot)";

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        res.status(500).send('Twilio credentials are not properly set.');
        return;
    }

    const client = twilio(accountSid, authToken);

    client.messages
        .create({
            to: to,
            from: twilioPhoneNumber,
            body: smsHeader + '\n' + body,
        })
        .then(message => {
            console.log(message.sid);
            res.send('SMS sent successfully.');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error sending SMS.');
        });
});

// Server setup
const PORT: number = parseInt(process.env.PORT || '3001');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
