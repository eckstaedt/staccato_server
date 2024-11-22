import { Telegraf } from 'telegraf';
import { MailUtilsBible } from './utils/MailUtilsBible';
import { render } from '@react-email/render';
import BibleConfirm, { Props } from '../../emails/BibleConfirm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

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
    let result;

    result = await telegraf.telegram.sendMessage(63117481, `Neue Anmeldung\nName: ${record.firstName} ${record.lastName}\nAnzahl: ${record.seats}\nEmail: ${record.email}\nSlot: ${record.slot}`);

    const supabase: SupabaseClient = createClient(process.env.SUPABASE_FECG_URL as string, process.env.SUPABASE_FECG_KEY as string);

    const { data, error } = await supabase
        .from('bibleSlots')
        .select(`
            *,
            date:bibleDates(id, date)
        `)
        .eq('id', record.slot);

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
        return;
    }

    const props: Props = {
        name: record.firstName + " " + record.lastName,
        slot: `${dayjs(data[0].date.date).format("DD.MM.YYYY")} ${data[0].start}`,
        seats: record.seats,
    };
    const emailHtml = render(<BibleConfirm {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_BIBLE_USER,
        to: record.email,
        subject: `Bibelausstellung: Anmeldebestätigung`,
        html: emailHtml,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsBible.createTransporter()

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