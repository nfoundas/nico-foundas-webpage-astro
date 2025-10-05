import { createTransport, type Transporter } from "nodemailer";

type SendEmailOptions = {
  /** Email address of the recipient */
  name: string;
  /** Subject line of the email */
  email: string;
  /** Message used for the body of the email */
  html: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<Transporter> {
  const transporter = await getEmailTransporter();
  return new Promise(async (resolve, reject) => {
    // Build the email message
    const to = import.meta.env.SEND_EMAIL_TO;
    const from = import.meta.env.SEND_EMAIL_FROM;
    const { name, email, html } = options;
    const subject = `New inquiry from ${name} (${email})`;
    const message = { to, subject, html, from };
    console.log(message);
    // Send the email
    transporter.sendMail(message, (err, info) => {
      // Log the error if one occurred
      if (err) {
        console.error(err);
        reject(err);
      }
      // Log the message ID and preview URL if available.
      console.log("Message sent:", info.messageId);
      resolve(info);
    });
  });
}

async function getEmailTransporter(): Promise<Transporter> {
  return new Promise((resolve, reject) => {
    if (!import.meta.env.RESEND_API_KEY) {
      throw new Error("Missing Resend configuration");
    }
    const transporter = createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: { user: "resend", pass: import.meta.env.RESEND_API_KEY },
    });
    resolve(transporter);
  });
}