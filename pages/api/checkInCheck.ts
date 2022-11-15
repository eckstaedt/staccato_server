import { NextApiRequest, NextApiResponse } from "next";
import { CheckInUtils } from "./utils/CheckInUtils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { env } = req.body;

    try {
        await CheckInUtils.executeCheckInCompletion(Number(10), env);
        res.status(200).end();
    } catch (error) {
        res.status(500).json(error)
    }
}