import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import AttRegister, { Props } from '../../emails/AttRegister';
import { MailUtilsAttendix } from './utils/MailUtilsAttendix';

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
    const { email, name } = req.body;
    const password: string = createPassword();
    let supabase: SupabaseClient;

    supabase = createClient(process.env.SUPABASE_ATTENDIX_URL as string, process.env.SUPABASE_ATTENDIX_KEY as string);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
        return;
    }

    const props: Props = {
        email,
        password,
        name,
        url: "https://attendix.de",
        appName: "Attendix",
        imageUrl: "https://ultyjzgwejpehfjuyenr.supabase.co/storage/v1/object/public/profiles/bg.jpeg"
    };
    const emailHtml = render(<AttRegister {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_ATTENDIX_USER,
        to: req.body.email,
        subject: `Deine Zugangsdaten für die Attendix-App`,
        html: emailHtml,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ user: data.user, mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsAttendix.createTransporter()

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