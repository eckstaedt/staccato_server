import { Telegraf } from 'telegraf';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    const supabase: SupabaseClient = createClient(process.env.SUPABASE_FECG_URL as string, process.env.SUPABASE_FECG_KEY as string);

    const { data, error } = await supabase
        .from('kantate')
        .select("*")
        .eq('active', true);

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
        return;
    }

    let persons: number = 0;

    for (const row of data) {
        persons += row.persons;
    }

    const telegraf = new Telegraf(process.env.VOS_BOT as string);

    await telegraf.telegram.sendMessage(63117481, `Kantate\nAnzahl Anmeldungen: ${persons}`);
    await telegraf.telegram.sendMessage(590859681, `Kantate\nAnzahl Anmeldungen: ${persons}`);

    res.status(200).end(JSON.stringify({ success: true }));
}

module.exports = allowCors(handler);