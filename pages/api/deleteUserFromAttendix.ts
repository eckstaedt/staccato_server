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
    const { id } = req.body;
    const supabase: SupabaseClient = createClient(process.env.SUPABASE_ATTENDIX_URL as string, process.env.SUPABASE_ATTENDIX_KEY as string);

    const { error: errorDeleteUser } = await supabase.auth.admin.deleteUser(id);

    if (errorDeleteUser) {
        res.status(500).end(JSON.stringify({ errorDeleteUser }));
        return;
    }

    res.status(200).end();
}

module.exports = allowCors(handler);