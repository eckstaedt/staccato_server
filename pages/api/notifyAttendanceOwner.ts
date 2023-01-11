import { Telegraf } from 'telegraf';

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
    let message: string;
    const { name, type, reason, dates } = req.body; // appName

    if (type === "signin") {
        message = `${name} hat sich für den ${dates[0]} wieder angemeldet.`;
    } else {
        message = `${name} hat sich für folgendende Termine abgemeldet:\n- ${dates.join("\n- ")}\n\nGrund: ${reason}`;
    }

    const telegraf = new Telegraf(process.env.SOS_BOT as string);

    telegraf.telegram.sendMessage(60965786, message);

    res.status(200).end(JSON.stringify({ success: true }));
}

module.exports = allowCors(handler);