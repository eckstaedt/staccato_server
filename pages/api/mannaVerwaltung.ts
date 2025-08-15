import { MailUtilsFecg } from './utils/MailUtilsFecg';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // wichtig für formidable
    },
};

const allowCors = (fn: any) => async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

const handler = async (req: any, res: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err: any, fields: any, files: any) => {
            if (err) {
                console.error('Form parse error', err);
                return res.status(500).json({ message: 'Form parsing failed' });
            }

            // Dateien in Nodemailer-Attachments konvertieren
            const attachments = Object.values(files).flat().map((file: any) => ({
                filename: file.originalFilename,
                content: fs.readFileSync(file.filepath),
            }));

            // Felder aus FormData
            const {
                lastName,
                firstName,
                address,
                bankInstitution,
                iban,
                costCategory,
                totalAmount,
                expenses
            } = fields;

            // E-Mail-Inhalt
            const mailOptions = {
                from: '"Formular Versand" <info@fecg-speyer.de>',
                to: 'eckstaedt98@gmail.com',
                subject: 'Neue Formulardaten eingegangen',
                text: `
Nachname: ${lastName}
Vorname: ${firstName}
Adresse: ${address}
Bank: ${bankInstitution}
IBAN: ${iban}
Kategorie: ${costCategory}
Gesamtbetrag: ${totalAmount}
Ausgaben: ${expenses}
                `,
                attachments
            };

            // E-Mail senden
            const success = await sendMail(mailOptions);

            if (!success) {
                return res.status(500).json({ message: 'E-Mail-Versand fehlgeschlagen' });
            }

            res.status(200).json({ message: 'E-Mail erfolgreich gesendet' });
        });

    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);
        res.status(500).json({ message: 'Fehler beim Senden der E-Mail' });
    }
};

const sendMail = (mailOptions: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
        const transporter = await MailUtilsFecg.createTransporter(
            "info@fecg-speyer.de",
            process.env.STRATO_FECG_INFO_PASSWORD as string
        );

        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
};

module.exports = allowCors(handler);
