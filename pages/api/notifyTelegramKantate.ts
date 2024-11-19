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
    const { record } = req.body;

    const telegraf = new Telegraf(process.env.VOS_BOT as string);
    let result;

    result = await telegraf.telegram.sendMessage(63117481, `Neue Anmeldung\nName: ${record.firstName} ${record.lastName}\nAnzahl: ${record.persons}\nEmail: ${record.email}${record.questions ? '\nFrage: ' + record.questions : ''}`);

    res.status(200).end(JSON.stringify({ success: JSON.stringify(result) }));
}

module.exports = allowCors(handler);