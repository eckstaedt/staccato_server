import { NextApiRequest, NextApiResponse } from "next";
import { CheckInUtils } from "./utils/CheckInUtils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { env, id } = req.body;

    try {
        await CheckInUtils.executeCheckInCompletion(Number(id), env);
        res.status(200).end();
    } catch (error) {
        res.status(500).json(error)
    }
}