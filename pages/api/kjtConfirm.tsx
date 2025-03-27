import { Telegraf } from 'telegraf';
import { MailUtilsFecg } from './utils/MailUtilsFecg';
import { render } from '@react-email/render';
import KjtConfirm, { Props } from '../../emails/KjtConfirm';

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

    const workshops: any = {
        kids: [
            {
                id: "1",
                name: "Die ersten Schritte im Dienst",
            },
            {
                id: "2",
                name: "Der Kinderstundenleiter - Freund und Lehrer",
            },
            {
                id: "3",
                name: "Umgang mit Mobbing",
            },
            {
                id: "4",
                name: "Praktische Sonntagschule",
            },
        ],
        teens: [
            {
                id: "1",
                name: "Die ersten Schritte im Dienst",
            },
            {
                id: "2",
                name: "Der Jungscharleiter - Freund und Lehrer",
            },
            {
                id: "3",
                name: "Seelsorge und Begleitung",
            },
            {
                id: "4",
                name: "Umgang mit Mobbing",
            },
            {
                id: "5",
                name: "Medien",
            }
        ],
    };

    let ws1: string = "";
    let ws2: string = "";

    if (record.workshops.length === 2) {
        ws1 = workshops[record.type].find((ws: any) => ws.id === record.workshops[0])?.name ?? "Nicht bekannt";
        ws2 = workshops[record.type].find((ws: any) => ws.id === record.workshops[1])?.name ?? "Nicht bekannt";
    }

    const props: Props = {
        name: record.firstName,
        ws1,
        ws2,
    };
    const emailHtml = render(<KjtConfirm {...props} />);
    const mailOptions: any = {
        from: process.env.STRATO_KJT_USER,
        to: record.email,
        subject: `KJT Workshops: Anmeldebestätigung`,
        html: emailHtml,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    await telegraf.telegram.sendMessage(
        63117481,
        `KJT\nName: ${record.firstName} ${record.lastName}\nGemeinde: ${record.church}\nEmail: ${record.email}\nTyp: ${record.type}\nFragen: ${record.questions ?? "keine"}`,
        { parse_mode: undefined },
    );

    res.status(200).end(JSON.stringify({ mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsFecg.createTransporter(process.env.STRATO_BIBLE_USER as string);

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