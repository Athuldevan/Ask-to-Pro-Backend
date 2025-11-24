interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export declare const sendMail: ({ to, subject, text, html }: MailOptions) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export {};
//# sourceMappingURL=nodemailer.d.ts.map