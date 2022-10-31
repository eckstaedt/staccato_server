import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'Dirigentenschul API' })
}

/*
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    const { email, firstName, lastName, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    try {
        await transporter.sendMail({
            text: message,
            from: "manuel.eckstaedt@ebm-solutions.com",
            to: "manuel.eckstaedt@ebm-solutions.com",
            subject: `Anfrage: ${lastName}, ${firstName} (${email})`,
        });
    }
    catch (e) {
        res.status(400).end(JSON.stringify({ message: e }))
        return;
    }

    res.status(200).end(JSON.stringify({ message: 'Send Mail' }))
}
*/
