import {
  SESv2Client,
  SendEmailCommand,
  GetAccountCommand,
} from "@aws-sdk/client-sesv2";

const accessKey = process.env.AWS_SES_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SES_SECRET_ACCESS_KEY;

const sesClient = new SESv2Client({
  region: "eu-west-3",
  credentials: {
    accessKeyId: `${accessKey}`,
    secretAccessKey: `${secretKey}`,
  },
});

interface MailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export const transporter = {
  async sendMail(mailOptions: MailOptions) {
    const { from, to, subject, html, text } = mailOptions;

    const command = new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: html,
              Charset: "UTF-8",
            },
            ...(text && {
              Text: {
                Data: text,
                Charset: "UTF-8",
              },
            }),
          },
        },
      },
    });

    return await sesClient.send(command);
  },

  async verify() {
    // Verify SES connection by making a simple API call
    const command = new GetAccountCommand({});
    await sesClient.send(command);
    return true;
  },
};
