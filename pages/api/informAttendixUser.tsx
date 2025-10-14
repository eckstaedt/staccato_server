import { render } from '@react-email/render';
import { MailUtilsAttendix } from './utils/MailUtilsAttendix';
import AttInform, { Props } from '../../emails/AttInform';

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
    const { email, name, role, tenant } = req.body;

    const props: Props = {
        name,
        url: "https://attendix.de",
        appName: "Attendix",
        imageUrl: "https://ultyjzgwejpehfjuyenr.supabase.co/storage/v1/object/public/profiles/login.jpeg",
        tenant,
        role
    };
    const emailHtml = render(<AttInform {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_ATTENDIX_USER,
        to: email,
        subject: `Du wurdest zu einer Attendix-Instanz hinzugefügt`,
        html: emailHtml,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ mailSent }));
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

module.exports = allowCors(handler);