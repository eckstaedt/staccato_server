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
    const { name, project, waitlist } = req.body;

    const telegraf = new Telegraf(process.env.FMJ_BOT as string);
    let result;

    if (waitlist) {
        result = await telegraf.telegram.sendMessage(63117481, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}\nWarteliste: ${waitlist}`);
        result = await telegraf.telegram.sendMessage(795693551, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}\nWarteliste: ${waitlist}`);
        result = await telegraf.telegram.sendMessage(647346375, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}\nWarteliste: ${waitlist}`);
    } else {
        result = await telegraf.telegram.sendMessage(63117481, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}`);
        result = await telegraf.telegram.sendMessage(795693551, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}`);
        result = await telegraf.telegram.sendMessage(647346375, `Neue Anmeldung\nName: ${name}\nProjekt: ${project}`);
    }

    res.status(200).end(JSON.stringify({ success: JSON.stringify(result) }));
}

module.exports = allowCors(handler);