import { MailUtilsTrips } from './utils/MailUtilsTrips';

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
    const { email, firstName } = req.body;

    const mailOptions: any = {
        from: process.env.STRATO_USER_TRIPS,
        to: email,
        subject: `Dein Account für die Trips-App wurde aktivert!`,
        body: `Grüß dich ${firstName},</br></br>Dein Account wurde freigeschaltet. Du kannst dich jetzt mit deiner E-Mail Adresse und deinem zuvor vergebenem Passwort anmelden.</br><a href="https://trips.fecg-speyer.de">Hier anmelden!</a></br></br>Gottes Segen</br>`,
    };

    const mailSent: boolean = await sendMail(mailOptions);

    res.status(200).end(JSON.stringify({ mailSent }));
}

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsTrips.createTransporter()

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