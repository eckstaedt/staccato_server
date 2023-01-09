import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MailUtilsAttendance } from './utils/MailUtilsAttendance';

const allowCors = (fn: any) => async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

const handler = async (req: any, res: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { email, name, appName, url } = req.body;
    const password: string = createPassword();
    let supabase: SupabaseClient;

    if (appName === "SoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY as string);
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_BOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_BOS as string);
    }

    const { data, error } = await supabase.auth.signUp({
        email, password
    });

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
    }

    const mailOptions: any = {
        from: process.env.STRATO_USER,
        to: req.body.email,
        subject: `Deine Zugangsdaten für die ${appName}-App`,
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${appName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 10px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                            <tr>
                                <td align="center" style="color: #153643; font-size: 23px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="https://dwexedvloevhzoanxefp.supabase.co/storage/v1/object/public/public/login.jpeg" alt="Header" width="100%" height="300" style="display: block;" />
                                    <div style="background: #ffffff; margin-top: -60px; position: relative; width: 100px; height: 100px; border-radius: 100px; border: 1px solid #005238;">
                                        <img src="https://dwexedvloevhzoanxefp.supabase.co/storage/v1/object/public/public/icon.png" alt="Creating Email Magic" height="80" style="display: block; margin-top: 10px" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 20px 30px 0 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 20px;">
                                                <b>Shalom ${name},</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="white-space: pre-line; padding: 10px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                Anbei deine Zugangsdaten für die ${appName}-App:<br/>E-Mail: ${email}<br/>Passwort: ${password}<br/><br/><a href="${url}">Zur App</a><br/><br/>Mit Gottes Segen,<br>Deine Dirigenten
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ user: data.user, mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsAttendance.createTransporter()

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}

const createPassword = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = '';

    for (var i = 0; i <= 10; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
}

module.exports = allowCors(handler);