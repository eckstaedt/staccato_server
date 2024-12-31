import { Telegraf } from 'telegraf';
import { MailUtilsFecg } from './utils/MailUtilsFecg';
import { render } from '@react-email/render';
import KantateFeedback, { Props } from '../../emails/KantateFeedback';

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

const handler = async (_: any, res: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const transporter = await MailUtilsFecg.createTransporter(process.env.STRATO_KANTATE_USER as string);
    const results = [];

    for (const rec of [] as any) {
        const props: Props = {
            name: `${rec.firstName} ${rec.lastName}`,
        };

        const emailHtml = render(<KantateFeedback {...props} />);
        const mailOptions: any = {
            from: process.env.STRATO_KANTATE_USER,
            to: rec.email,
            bcc: "kantate@fecg-speyer.de",
            subject: `Kantate: Feedback`,
            html: emailHtml,
        };

        results.push(await sendMail(mailOptions, transporter));
    }

    res.status(200).end(JSON.stringify({ success: JSON.stringify(results) }));
}

const sendMail = (mailOptions: any, transporter: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        transporter.sendMail(mailOptions, function (error: any, info: any) {
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
