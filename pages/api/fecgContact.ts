import { MailUtilsFecg } from './utils/MailUtilsFecg';

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
    const { email, name, message } = req.body;

    const mailOptions: any = {
        from: "info@fecg-speyer.de",
        to: "info@fecg-speyer.de",
        subject: `Kontaktformular Website: Anfrage von ${name} (${email})`,
        html: message,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsFecg.createTransporter("info@fecg-speyer.de", process.env.STRATO_FECG_INFO_PASSWORD as string);

        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}

module.exports = allowCors(handler);