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
    const { appShortName, id, useTrips } = req.body;
    let supabase: SupabaseClient;

    if (useTrips) {
        supabase = createClient(process.env.TRIPS_SUPABASE_URL as string, process.env.TRIPS_SUPABASE_SERVICE_ROLE as string);
    } else {
        if (appShortName === "SoS") {
            supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_SERVICE_ROLE_SOS as string);
        } else if (appShortName === "VoS") {
            supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_VOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_SERVICE_ROLE_VOS as string);
        } else if (appShortName === "BoS") {
            supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_BOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_SERVICE_ROLE_BOS as string);
        } else if (appShortName === "GoS") {
            supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_GOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_SERVICE_ROLE_GOS as string);
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_JUCHO as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_SERVICE_ROLE_JUCHO as string);
        }
    }

    const { error: errorDeleteUser } = await supabase.auth.admin.deleteUser(id);

    if (errorDeleteUser) {
        res.status(500).end(JSON.stringify({ errorDeleteUser }));
        return;
    }

    res.status(200).end();
}

module.exports = allowCors(handler);