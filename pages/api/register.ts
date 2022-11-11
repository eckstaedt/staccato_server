import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MailUtils } from './utils/MailUtils';

export default async function handler(req: any, res: any) {
    const { email, name, isProd } = req.body;
    const password: string = createPassword();
    let supabase: SupabaseClient;

    if (isProd) {
        supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROD as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD as string);
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
    }

    const { data, error } = await supabase.auth.signUp({
        email, password
    });

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
    }

    const mailOptions: any = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Deine Zugangsdaten für die Dirigentenschul-App",
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Dirigentenschule</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 10px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                            <tr>
                                <td align="center" style="color: #153643; font-size: 23px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/staccato.appspot.com/o/mail%2Fheader.jpeg?alt=media&token=1c2494ce-835e-4b39-b55a-026e76adcfa3" alt="Header" width="100%" height="300" style="display: block;" />
                                    <div style="background: #ffffff; margin-top: -60px; position: relative; width: 100px; height: 100px; border-radius: 100px; border: 1px solid #005238;">
                                        <img src="https://firebasestorage.googleapis.com/v0/b/staccato.appspot.com/o/mail%2Flogo.png?alt=media&token=89fb7498-b932-4dd6-93b9-50496b2f495e" alt="Creating Email Magic" height="80" style="display: block; margin-top: 5px" />
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
                                                Anbei deine Zugangsdaten für die Dirigentenschul-App${isProd ? "" : " (TESTUMGEBUNG)"}:<br/>E-Mail: ${email}<br/>Passwort: ${password}<br/><br/><a href="${isProd ? "https://app.dirigentenschule.de" : "https://staccato.vercel.app"}">Hierüber gelangst du zur App</a><br/><br/>Mit Gottes Segen,<br>Die Dirigentenschulleitung
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#454545" style="padding: 30px 30px 30px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="50%">
                                                <a href="mailto:dirigentenschule@gmail.com" style="color: #ffffff;"><font color="#ffffff">dirigentenschule@gmail.com</font></a>
                                            </td>
                                            <td style="font-family: Arial; font-size: 14px;" align="right" width="50%">
                                                <a href="www.dirigentenschule.de" style="color: #ffffff;"><font color="#ffffff">www.dirigentenschule.de</font></a><br/>
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
        const transporter = await MailUtils.createTransporter()

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