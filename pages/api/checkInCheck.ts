import { NextApiRequest, NextApiResponse } from "next";
import { CheckInUtils } from "./utils/CheckInUtils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { env } = req.body;

    try {
        const attendances: any[] = await CheckInUtils.getOpenAttendances(env);

        for (const att of attendances) {
            await CheckInUtils.executeCheckInCompletion(att.id, env);
        }
        res.status(200).end();
    } catch (error) {
        res.status(500).json(error)
    }
}