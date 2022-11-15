import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { isProd, id } = req.body;

    if (id) {
        let supabase: SupabaseClient;

        if (isProd) {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROD as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD as string);
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
        }

        const { data: attData, error: attError } = await supabase
            .from("attendances")
            .update({
                checkInActive: false,
            })
            .match({ id })
            .select()
            .single();

        if (attError) {
            res.status(500).json(attError);
        }

        const { error, data } = await supabase
            .from("checkIn")
            .select()
            .match({ attId: id });

        if (attError) {
            res.status(500).json(error);
        }

        const userIds = data?.map((checkInData) => checkInData.userId);
        let absentUsers = [];

        if (attData) {
            absentUsers = attData.absentUsers.filter((id: number) => !userIds?.includes(id));
        }

        await supabase
            .from("attendances")
            .update({
                absentUsers,
            })
            .match({ id })
            .select();

        res.status(200).end();
    } else {
        res.status(500).json({ error: "no id commited" });
    }
}