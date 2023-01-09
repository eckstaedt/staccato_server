import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

export class MailUtilsAttendance {
    public static async createTransporter() {
        const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
            host: 'smtp.strato.de',
            port: 465,
            secure: true,
            auth: {
                user: process.env.STRATO_USER,
                pass: process.env.STRATO_PASSWORD,
            }
        });

        return transporter;
    };
}