import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

export class MailUtils {
    public static async createTransporter() {
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken: string = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err: any, token: any) => {
                if (err) {
                    reject();
                }
                resolve(token);
            });
        });

        const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL as string,
                accessToken: accessToken,
                clientId: process.env.CLIENT_ID as string,
                clientSecret: process.env.CLIENT_SECRET as string,
                refreshToken: process.env.REFRESH_TOKEN as string,
            },
        });

        return transporter;
    };
}