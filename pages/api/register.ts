// import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
    const { user, isProd } = req.body;

    res.status(200).end(JSON.stringify({ user: 'Send Mail' }))
}