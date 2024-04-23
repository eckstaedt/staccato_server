import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

export class MailUtilsFmj {
    public static async createTransporter() {
        const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
            host: 'smtp.strato.de',
            port: 465,
            secure: true,
            auth: {
                user: process.env.STRATO_FMJ_USER,
                pass: process.env.STRATO_FMJ_PASSWORD,
            }
        });

        return transporter;
    };
}

// 63117481 meine ID
