import { SupabaseClient, createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
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
    const { shortName, isChoir } = req.body; // appName

    let supabase: SupabaseClient;

    if (shortName === "SoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY as string);
    } else if (shortName === "VoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_VOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_VOS as string);
    } else if (shortName === "BoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_BOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_BOS as string);
    } else if (shortName === "GoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_GOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_GOS as string);
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_JUCHO as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_JUCHO as string);
    }

    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .match({ id: 1 })
        .single();

    const { data: attendances } = await supabase
        .from('attendance')
        .select('*')
        .gt("date", settings?.attDate || dayjs("2023-01-01").toISOString())
        .lt("date", dayjs().endOf("day"))
        .limit(3);
    let updated: boolean = false;

    const { data: players } = await supabase
        .from('player')
        .select('*')
        .is("left", null)
        .order("instrument")
        .order("isLeader", {
            ascending: false
        })
        .order("lastName");

    if (players && attendances) {
        for (const player of players) {
            if (attendances[0] && attendances[1] && (isChoir || attendances[2]) && !player.isCritical &&
                (!player.lastSolve || dayjs(player.lastSolve).isBefore(dayjs().subtract(15, "days"))) &&
                attendances[0].players.hasOwnProperty(player.id) && !isPresent(attendances[0].players[player.id]) &&
                attendances[1].players.hasOwnProperty(player.id) && !isPresent(attendances[1].players[player.id]) &&
                (isChoir || attendances[2].players.hasOwnProperty(player.id) && !isPresent(attendances[2].players[player.id]))) {

                updated = true;
                let history: any[] = player.history;

                history.push({
                    date: new Date().toISOString(),
                    text: "Fehlt oft hintereinander",
                    type: 3,
                });
                await supabase
                    .from('player')
                    .update({
                        ...player,
                        isCritical: true,
                        criticalReason: 3,
                        history
                    })
                    .match({ id: player.id })
            }
        }

        if (updated) {
            const telegraf = new Telegraf(process.env.VOS_BOT as string);

            telegraf.telegram.sendMessage(63117481, `Neue Problemfälle (${shortName}):\n`);
        }

        res.status(200).end(JSON.stringify({ success: true }));
    } else {
        res.status(400).end(JSON.stringify({ failure: "no players and attendances" }));
    }
}

const isPresent = (attStatus: number) => {
    return attStatus !== 2 && attStatus !== 4;
};

module.exports = allowCors(handler);