import twilio from 'twilio';

interface SendSMSOptions {
  to: string[];
  body: string;
}

export const sendSMS = (options: SendSMSOptions): void => {
  const { to, body } = options;

  // Fetching Twilio credentials from environment variables
  const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';
  const authToken: string = process.env.TWILIO_AUTH_TOKEN || '';
  const twilioPhoneNumber: string = process.env.TWILIO_PHONE_NUMBER || '';
  const smsHeader: string = "(Andrew's automation robot)";

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials in env are not properly set.');
  }

  const client = twilio(accountSid, authToken);

  to.forEach(recipient => {
    client.messages.create({
      to: recipient,
      from: twilioPhoneNumber,
      body: smsHeader + '\n' + body,
    })
    .then(message => console.log(message.sid))
    .catch(error => {
      console.error(error);
      throw new Error(`Twilio call error sending SMS to ${recipient}.`);
    });
  });
};
