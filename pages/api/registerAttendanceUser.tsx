import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MailUtilsAttendance } from './utils/MailUtilsAttendance';
import { render } from '@react-email/render';
import AttRegister, { Props } from '../../emails/AttRegister';

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
    const { email, name, appName, url, shortName } = req.body;
    const password: string = createPassword();
    let supabase: SupabaseClient;
    console.log(process.env);
    if (shortName === "SoS") {
        supabase = createClient('https://dwexedvloevhzoanxefp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3ZXhlZHZsb2V2aHpvYW54ZWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg1NDM1MjcsImV4cCI6MTk4NDExOTUyN30.7iCMeGLWRiB28Mxh9PyQk0pyFg4ooc9WKird3vr23r4');
    } else if (shortName === "VoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_VOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_VOS as string);
    } else if (shortName === "BoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_BOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_BOS as string);
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_JUCHO as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_JUCHO as string);
    }
 
    const { data, error } = await supabase.auth.signUp({
        email, password
    });

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
        return;
    }

    const props: Props = {
        email,
        password,
        name,
        appName,
        url,
        imageUrl: appName === "Jugendchor" ? "https://dwexedvloevhzoanxefp.supabase.co/storage/v1/object/public/public/loginChoir.jpeg" : appName === "Blasorchester" ? "https://dwexedvloevhzoanxefp.supabase.co/storage/v1/object/public/public/loginBlas.jpeg" : "https://dwexedvloevhzoanxefp.supabase.co/storage/v1/object/public/public/login.jpeg"
    };
    const emailHtml = render(<AttRegister {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_USER,
        to: req.body.email,
        subject: `Deine Zugangsdaten für die ${appName}-App`,
        html: emailHtml,
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