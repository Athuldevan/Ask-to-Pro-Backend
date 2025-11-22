import nodemailer from 'nodemailer'

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)
export const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
