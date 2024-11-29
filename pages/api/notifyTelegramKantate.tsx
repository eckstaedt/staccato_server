import { Telegraf } from 'telegraf';
import { MailUtilsFecg } from './utils/MailUtilsFecg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import KantateConfirm, { Props } from '../../emails/KantateConfirm';

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
    const { record } = req.body;

    const telegraf = new Telegraf(process.env.VOS_BOT as string);

    await telegraf.telegram.sendMessage(
        63117481,
        `*Kantate*\nName: ${record.firstName} ${record.lastName}\nAnzahl: ${record.persons}\nEmail: ${record.email}${record.questions ? '\nFrage: ' + record.questions : ''}`,
        { parse_mode: 'Markdown' }
    );

    const props: Props = {
        name: record.firstName + " " + record.lastName,
        seats: record.persons,
    };
    const emailHtml = render(<KantateConfirm {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_KANTATE_USER,
        to: record.email,
        subject: `Kantate: Anmeldebestätigung`,
        html: emailHtml,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ success: JSON.stringify(mailSent) }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsFecg.createTransporter(process.env.STRATO_KANTATE_USER as string);

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