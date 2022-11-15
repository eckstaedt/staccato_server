import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export class CheckInUtils {
    public static async getOpenAttendances(env: string): Promise<any[]> {
        let supabase: SupabaseClient;

        if (env === "prod") {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROD as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD as string);
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
        }

        const { data, error } = await supabase
            .from("attendances")
            .select()
            .lt("checkInActive", dayjs().subtract(1, "minute").toISOString());

        if (error) {
            throw error;
        }

        return data ?? [];
    }

    public static async executeCheckInCompletion(id: number, env: string) {
        let supabase: SupabaseClient;

        if (env === "prod") {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_PROD as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD as string);
        } else {
            supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
        }

        const { data: attData, error: attError } = await supabase
            .from("attendances")
            .update({
                checkInActive: false
            })
            .match({ id })
            .select()
            .single();

        if (attError) {
            throw attError;
        }

        const { error, data } = await supabase
            .from("checkIn")
            .select()
            .match({ attId: id });

        if (attError) {
            throw error;
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
                checkInCompleted: true
            })
            .match({ id })
            .select();

        return;
    }
}