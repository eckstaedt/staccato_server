import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
    const { email, password } = req.body;
    let supabase: SupabaseClient = createClient(process.env.TRIPS_SUPABASE_URL as string, process.env.TRIPS_SUPABASE_SERVICE_ROLE as string);

    const { data, error } = await supabase.auth.signUp({
        email, password
    });

    if (error) {
        res.status(500).end(JSON.stringify({ error }));
        return;
    }

    const telegraf = new Telegraf(process.env.TRIPS_BOT as string);
    telegraf.telegram.sendMessage(63117481, `Neue Registrierung vorhanden: ${email}\nJetzt unter https://trips.fecg-speyer.de/tabs/einstellungen aktivieren`);
    telegraf.telegram.sendMessage(process.env.TRIPS_ARWID_ID as string, `Neue Registrierung vorhanden: ${email}\nJetzt unter https://trips.fecg-speyer.de/tabs/einstellungen aktivieren`);

    res.status(200).end(JSON.stringify({ user: data.user }));
}

module.exports = allowCors(handler);