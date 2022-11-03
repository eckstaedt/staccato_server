import type { NextApiRequest, NextApiResponse } from 'next';
import { MailUtils } from './utils/MailUtils';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // res.setHeader("Access-Control-Allow-Origin", "*");

    const opt = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Dein Account in der Dirigentenschul-App",
    };

    (await MailUtils.createTransporter()).sendMail(opt, function (err: any, info: any) {
        if (err) {
            console.log(err);
            res.status(200).end(JSON.stringify({
                response: `Die E-Mail an "TEST" konnte nicht versendet werden`,
            }));
        } else {
            console.log(info);
            res.status(200).end(JSON.stringify({
                response: `Die E-Mail an "TEST" wurde erfolgreich versandt`,
            }));
        }
    });
}
