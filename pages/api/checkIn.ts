import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { isProd, id } = req.body;

    if (id) {
        console.log(isProd, id);
        setTimeout(async () => {
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
                console.log(attError);
            }

            const { error, data } = await supabase
                .from("checkIn")
                .select()
                .match({ attId: id });

            if (attError) {
                console.log(error);
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
        }, 60000);
    }

    res.status(200).end();
}