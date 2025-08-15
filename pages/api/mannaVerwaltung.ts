import { MailUtilsFecg } from './utils/MailUtilsFecg';
import formidable from 'formidable';
import { Writable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // let formidable handle the body
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      multiples: true,
      fileWriteStreamHandler: () => {
        const chunks: Buffer[] = [];
        const writable = new Writable({
          write(chunk, encoding, callback) {
            chunks.push(chunk);
            callback();
          },
        });
        // custom property to store buffer
        // @ts-ignore
        writable.on('finish', () => (writable.buffer = Buffer.concat(chunks)));
        return writable;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parse error', err);
        return res.status(500).json({ message: 'Form parsing failed' });
      }

      // Build attachments directly from memory buffers
      const attachments = Object.values(files)
        .flat()
        .map((file: any) => ({
          filename: file.originalFilename,
          // @ts-ignore — buffer set in fileWriteStreamHandler
          content: file.filepath.buffer || file.buffer || file._writeStream?.buffer,
        }));

      const mailOptions = {
        from: '"Formular Versand" <info@fecg-speyer.de>',
        to: 'empfaenger@example.com',
        subject: 'Neue Formulardaten eingegangen',
        text: `
Nachname: ${fields.lastName}
Vorname: ${fields.firstName}
Adresse: ${fields.address}
Bank: ${fields.bankInstitution}
IBAN: ${fields.iban}
Kategorie: ${fields.costCategory}
Gesamtbetrag: ${fields.totalAmount}
Ausgaben: ${fields.expenses}
        `,
        attachments,
      };

      // Respond immediately — email sending happens in background
      res.status(200).json({ message: 'Form received, email sending in background' });

      // Send email without blocking response
      sendMail(mailOptions).catch((error) => {
        console.error('Background email send failed:', error);
      });
    });
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Anfrage:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
};

const sendMail = (mailOptions: any): Promise<boolean> => {
  return new Promise(async (resolve) => {
    const transporter = await MailUtilsFecg.createTransporter(
      'info@fecg-speyer.de',
      process.env.STRATO_FECG_INFO_PASSWORD as string
    );

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log('error is ' + error);
        resolve(false);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = allowCors(handler);