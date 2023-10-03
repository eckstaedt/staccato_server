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
    const { appShortName, userEmail } = req.body;
    let supabase: SupabaseClient;

    if (appShortName === "SoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL as string, process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY as string);
    } else if (appShortName === "VoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_VOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_VOS as string);
    } else if (appShortName === "BoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_BOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_BOS as string);
    } else if (shortName === "GoS") {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_GOS as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_GOS as string);
    } else {
        supabase = createClient(process.env.NEXT_PUBLIC_ATT_URL_JUCHO as string, process.env.NEXT_PUBLIC_SUPABASE_ATT_KEY_JUCHO as string);
    }

    const { data: { users }, error: errorListUsers } = await supabase.auth.admin.listUsers();

    if (errorListUsers) {
        res.status(500).end(JSON.stringify({ errorListUsers }));
        return;
    }

    const authUser = users.find(user => user.email === userEmail);

    if (authUser) {
        const { data, error: errorDeleteUser } = await supabase.auth.admin.deleteUser(String(authUser?.id));

        if (errorDeleteUser) {
            res.status(500).end(JSON.stringify({ errorDeleteUser }));
            return;
        }
    }

    res.status(200).end();
}

module.exports = allowCors(handler);