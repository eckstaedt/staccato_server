import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
    const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
    const { email, password, isProd } = req.body;

    const { data } = await supabase.auth.signUp({
        email, password
    });

    res.status(200).end(JSON.stringify({ user: data.user }));
}