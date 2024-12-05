import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

export class MailUtilsFecg {
    public static async createTransporter(user: string, password?: string) {
        const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
            host: 'smtp.strato.de',
            port: 465,
            secure: true,
            auth: {
                user,
                pass: password ?? process.env.STRATO_BIBLE_PASSWORD,
            }
        });

        return transporter;
    };
}

// 63117481 meine ID
