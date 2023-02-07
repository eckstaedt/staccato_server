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
    const { url, shortName }: { url: string; telegramId: number, shortName: string } = req.body;

    const telegraf = new Telegraf(shortName === "VoS" ? process.env.VOS_BOT as string : shortName === "BoS" ? process.env.BOS_BOT as string : process.env.SOS_BOT as string);

    telegraf.telegram.sendDocument((shortName === "VoS" ? process.env.VOS_GROUP_ID : shortName === "BoS" ? process.env.BOS_GROUP_ID : process.env.SOS_GROUP_ID) as string, url);

    res.status(200).end(JSON.stringify({ success: true }));
}

module.exports = allowCors(handler);