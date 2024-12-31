import { Telegraf } from 'telegraf';
import { MailUtilsFecg } from './utils/MailUtilsFecg';
import { render } from '@react-email/render';
import KantateFeedback, { Props } from '../../emails/KantateFeedback';

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

const handler = async (_: any, res: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const transporter = await MailUtilsFecg.createTransporter(process.env.STRATO_KANTATE_USER as string);
    const results = [];

    for (const rec of first) {
        const props: Props = {
            name: `${rec.firstName} ${rec.lastName}`,
        };

        const emailHtml = render(<KantateFeedback {...props} />);
        const mailOptions: any = {
            from: process.env.STRATO_KANTATE_USER,
            to: rec.email,
            bcc: "kantate@fecg-speyer.de",
            subject: `Kantate: Feedback`,
            html: emailHtml,
        };

        results.push(await sendMail(mailOptions, transporter));
    }

    res.status(200).end(JSON.stringify({ success: JSON.stringify(results) }));
}

const sendMail = (mailOptions: any, transporter: any): Promise<boolean> => {
    return new Promise(async (resolve) => {
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

const old = [
    {
        "id": 113,
        "created_at": "2024-11-27T22:39:14.325155+00:00",
        "firstName": "Jessica",
        "lastName": "Becker",
        "email": "beckerjessica05@gmail.com",
        "persons": 6,
        "questions": "Es kann auch sein, dass mehr als 6 Personen kommen, ich bin mir aber noch nicht sicher",
        "active": true
    },
    {
        "id": 114,
        "created_at": "2024-11-28T11:37:48.56913+00:00",
        "firstName": "Daniel",
        "lastName": "Rose",
        "email": "rose.daniel001@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 115,
        "created_at": "2024-11-28T15:18:49.450419+00:00",
        "firstName": "Ingrid",
        "lastName": "Jung",
        "email": "ingrid-1990@web.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 116,
        "created_at": "2024-11-28T16:24:10.704276+00:00",
        "firstName": "Lara",
        "lastName": "Sadlowski",
        "email": "sadlowskilara@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 117,
        "created_at": "2024-11-28T18:23:20.177191+00:00",
        "firstName": "Sophia",
        "lastName": "Bart",
        "email": "sophia.bart05@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 118,
        "created_at": "2024-11-28T18:26:09.091359+00:00",
        "firstName": "Sofija",
        "lastName": "Enders",
        "email": "sofijaenders29@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 120,
        "created_at": "2024-11-28T20:52:20.489717+00:00",
        "firstName": "Jaqueline",
        "lastName": "Fröse",
        "email": "jaquelinefroese239@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 121,
        "created_at": "2024-11-29T08:09:35.405625+00:00",
        "firstName": "Esther",
        "lastName": "Kebernik",
        "email": "estherkebernik06@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 122,
        "created_at": "2024-11-29T09:48:46.444083+00:00",
        "firstName": "Vera",
        "lastName": "Schramke",
        "email": "veraf85@gmx.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 126,
        "created_at": "2024-11-29T18:00:43.197473+00:00",
        "firstName": "Anja",
        "lastName": "Lipowcan",
        "email": "Re.Belik@web.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 127,
        "created_at": "2024-11-29T22:52:52.796846+00:00",
        "firstName": "Anita",
        "lastName": "Gesswein",
        "email": "a.gesswein@yahoo.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 128,
        "created_at": "2024-11-30T22:07:18.016695+00:00",
        "firstName": "ida",
        "lastName": "berent",
        "email": "ida25berent@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 129,
        "created_at": "2024-12-01T10:11:09.084803+00:00",
        "firstName": "Nelia",
        "lastName": "Kunzmann",
        "email": "nelia1977k@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 130,
        "created_at": "2024-12-01T13:19:46.940616+00:00",
        "firstName": "Marvin",
        "lastName": "Jeske",
        "email": "marvinjeske147@gmail.com",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 131,
        "created_at": "2024-12-01T18:06:02.874851+00:00",
        "firstName": "Julia",
        "lastName": "Fries",
        "email": "friesj731@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 132,
        "created_at": "2024-12-02T16:01:14.820404+00:00",
        "firstName": "Ross",
        "lastName": "Fries",
        "email": "rosa07j@aol.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 134,
        "created_at": "2024-12-02T16:19:21.668283+00:00",
        "firstName": "Christine",
        "lastName": "Rose",
        "email": "Zimmermann_christa@gmx.net",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 135,
        "created_at": "2024-12-03T20:37:07.395521+00:00",
        "firstName": "Madleen",
        "lastName": "Naumow",
        "email": "madleen.naumow@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 136,
        "created_at": "2024-12-03T20:37:08.858751+00:00",
        "firstName": "Levin",
        "lastName": "Müller",
        "email": "muellerlev07@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 137,
        "created_at": "2024-12-03T22:13:31.573234+00:00",
        "firstName": "Marianne",
        "lastName": "Ganske",
        "email": "leonierusezki@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 138,
        "created_at": "2024-12-04T06:29:38.179056+00:00",
        "firstName": "Jasmin",
        "lastName": "Kunz",
        "email": "kunzjasi@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 140,
        "created_at": "2024-12-04T08:06:51.436803+00:00",
        "firstName": "Louis",
        "lastName": "Bullert",
        "email": "louis.bullert1@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 141,
        "created_at": "2024-12-04T15:52:49.388063+00:00",
        "firstName": "Ella",
        "lastName": "Pazer",
        "email": "ella.pazer@gmail.com",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 142,
        "created_at": "2024-12-04T19:11:05.030203+00:00",
        "firstName": "lea",
        "lastName": "kebernik",
        "email": "leakebernik@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 143,
        "created_at": "2024-12-04T21:31:37.975763+00:00",
        "firstName": "Julia",
        "lastName": "Schütz",
        "email": "julia.schuetz@pm.me",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 144,
        "created_at": "2024-12-05T09:51:47.550304+00:00",
        "firstName": "janette",
        "lastName": "könig",
        "email": "janettekoenig26@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 145,
        "created_at": "2024-12-05T11:41:42.319998+00:00",
        "firstName": "waldemar",
        "lastName": "Dachtler",
        "email": "wodila@online.de",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 147,
        "created_at": "2024-12-05T17:49:59.358549+00:00",
        "firstName": "Miriam",
        "lastName": "Moser",
        "email": "mimomomi33@gmail.com",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 148,
        "created_at": "2024-12-05T19:24:54.409926+00:00",
        "firstName": "Katarzyna",
        "lastName": "Bether-Firmanti",
        "email": "kbf41@icloud.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 149,
        "created_at": "2024-12-05T20:58:21.906005+00:00",
        "firstName": "Lina",
        "lastName": "Akulenko",
        "email": "linaakulenko@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 150,
        "created_at": "2024-12-05T21:26:45.695485+00:00",
        "firstName": "Natalia",
        "lastName": "Murzin",
        "email": "n.murzin@web.de",
        "persons": 7,
        "questions": "",
        "active": true
    },
    {
        "id": 151,
        "created_at": "2024-12-05T22:06:42.143746+00:00",
        "firstName": "Noah",
        "lastName": "Bastian",
        "email": "noah.bastian@gmmx.net",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 152,
        "created_at": "2024-12-05T22:45:02.736942+00:00",
        "firstName": "Noah",
        "lastName": "Bastian",
        "email": "noah.bastian@gmx.net",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 153,
        "created_at": "2024-12-06T09:58:49.322657+00:00",
        "firstName": "Jenny",
        "lastName": "Gorjaev",
        "email": "jenny_go@web.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 154,
        "created_at": "2024-12-06T12:00:44.009259+00:00",
        "firstName": "Talia",
        "lastName": "Kunz",
        "email": "talia.kunz@icloud.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 155,
        "created_at": "2024-12-06T12:01:35.111488+00:00",
        "firstName": "Luanne",
        "lastName": "Kunz",
        "email": "luannekunz45@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 157,
        "created_at": "2024-12-06T18:38:14.497017+00:00",
        "firstName": "Steven",
        "lastName": "Buling",
        "email": "stevenbuling@gmx.de",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 158,
        "created_at": "2024-12-06T21:12:34.142027+00:00",
        "firstName": "Sulamita",
        "lastName": "Nehring",
        "email": "nehringsulamita@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 159,
        "created_at": "2024-12-06T23:17:39.595205+00:00",
        "firstName": "Birgit",
        "lastName": "Hoos",
        "email": "hoos.birgit@gmx.de",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 160,
        "created_at": "2024-12-06T23:32:06.9814+00:00",
        "firstName": "Melanie",
        "lastName": "Rusezki",
        "email": "rusezkimelanie@web.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 161,
        "created_at": "2024-12-07T08:14:18.305567+00:00",
        "firstName": "Simone",
        "lastName": "Nehring",
        "email": "simone.nehring@web.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 162,
        "created_at": "2024-12-07T10:01:17.540842+00:00",
        "firstName": "Lydia",
        "lastName": "Weimer",
        "email": "weimer.andreas@gmx.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 163,
        "created_at": "2024-12-07T12:36:29.048477+00:00",
        "firstName": "Liane",
        "lastName": "Kort",
        "email": "lianeko98@gmx.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 164,
        "created_at": "2024-12-07T23:57:18.382323+00:00",
        "firstName": "Jason",
        "lastName": "Schurawel",
        "email": "jasonschurawel@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 165,
        "created_at": "2024-12-08T08:40:37.711014+00:00",
        "firstName": "Oksana",
        "lastName": "Frank",
        "email": "ksenja19@yahoo.com",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 166,
        "created_at": "2024-12-08T13:33:12.693555+00:00",
        "firstName": "Susanna",
        "lastName": "Sonnenberg",
        "email": "susisonnenberg2006@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 167,
        "created_at": "2024-12-08T14:39:03.410202+00:00",
        "firstName": "Waldemar",
        "lastName": "Barleben",
        "email": "waldemarbarleben@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 168,
        "created_at": "2024-12-08T15:20:51.246065+00:00",
        "firstName": "Jasmin",
        "lastName": "Janzen",
        "email": "janzenjasmin1207@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 169,
        "created_at": "2024-12-08T17:25:25.638293+00:00",
        "firstName": "Holger",
        "lastName": "Günther",
        "email": "hhguenth@gmail.com",
        "persons": 9,
        "questions": "",
        "active": true
    },
    {
        "id": 170,
        "created_at": "2024-12-08T17:52:23.383286+00:00",
        "firstName": "Stefan",
        "lastName": "Keller",
        "email": "stefan.keller03@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 171,
        "created_at": "2024-12-08T20:03:55.752605+00:00",
        "firstName": "Sabrina",
        "lastName": "Rusezki",
        "email": "sabrinarusezki@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 172,
        "created_at": "2024-12-08T20:21:47.96006+00:00",
        "firstName": "Raul",
        "lastName": "Sawal",
        "email": "r.sawal1996@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 173,
        "created_at": "2024-12-08T21:44:38.115643+00:00",
        "firstName": "Nadja",
        "lastName": "Sachwatkin",
        "email": "sachwatkin.nadja@gmx.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 174,
        "created_at": "2024-12-08T23:03:46.0511+00:00",
        "firstName": "Jennifer",
        "lastName": "Neubauer",
        "email": "fastkatharina@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 175,
        "created_at": "2024-12-09T06:31:18.179921+00:00",
        "firstName": "Davis",
        "lastName": "Merkel",
        "email": "davismerkel01@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 176,
        "created_at": "2024-12-09T10:19:10.197807+00:00",
        "firstName": "David",
        "lastName": "Bohle",
        "email": "david.bohle15@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 178,
        "created_at": "2024-12-09T12:21:21.766692+00:00",
        "firstName": "Eugen",
        "lastName": "Wegner",
        "email": "wegner.eugen@web.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 179,
        "created_at": "2024-12-09T13:27:48.562814+00:00",
        "firstName": "Luisa",
        "lastName": "Felker",
        "email": "luisafelker12@gmail.vom",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 180,
        "created_at": "2024-12-09T16:11:08.739968+00:00",
        "firstName": "Angelina",
        "lastName": "Kunz",
        "email": "angelina-koenig@web.de",
        "persons": 7,
        "questions": "",
        "active": true
    },
    {
        "id": 183,
        "created_at": "2024-12-09T19:46:28.597649+00:00",
        "firstName": "Elke",
        "lastName": "Kögel",
        "email": "elkekoegel@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 187,
        "created_at": "2024-12-10T12:14:40.478077+00:00",
        "firstName": "Tobias",
        "lastName": "Märtz",
        "email": "tobiasmaertz@t-online.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 188,
        "created_at": "2024-12-10T13:29:37.906258+00:00",
        "firstName": "Matthias",
        "lastName": "Krüger",
        "email": "krueger_matthias@gmx.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 189,
        "created_at": "2024-12-10T13:40:47.671017+00:00",
        "firstName": "Andreas",
        "lastName": "Merkel",
        "email": "annreasmerkel56@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 190,
        "created_at": "2024-12-10T14:00:06.167062+00:00",
        "firstName": "Helmut",
        "lastName": "Hoos",
        "email": "helmutannettehoos@gmx.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 191,
        "created_at": "2024-12-10T16:08:00.99254+00:00",
        "firstName": "Valentina",
        "lastName": "Betz",
        "email": "valentinabetz@gmx.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 192,
        "created_at": "2024-12-10T19:57:46.919333+00:00",
        "firstName": "Michelle",
        "lastName": "Bernhardt",
        "email": "michelle.bernhardt14@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 195,
        "created_at": "2024-12-10T20:58:52.79931+00:00",
        "firstName": "hermann",
        "lastName": "lehr",
        "email": "lehr.h@gmx.net",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 196,
        "created_at": "2024-12-10T21:12:52.867537+00:00",
        "firstName": "Johann",
        "lastName": "Flaming",
        "email": "johann.flaming@googlemail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 197,
        "created_at": "2024-12-11T05:46:53.84528+00:00",
        "firstName": "Jasmin",
        "lastName": "Otto",
        "email": "ottojasmin2000@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 198,
        "created_at": "2024-12-11T06:44:24.959387+00:00",
        "firstName": "Bettine",
        "lastName": "Deutschmann",
        "email": "bettina.deutschmann@web.de",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 199,
        "created_at": "2024-12-11T09:05:32.035824+00:00",
        "firstName": "Alexandra",
        "lastName": "Fast",
        "email": "alexandra.fast@yahoo.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 200,
        "created_at": "2024-12-11T16:47:02.412738+00:00",
        "firstName": "Danny",
        "lastName": "Bötcher",
        "email": "boetcher.d@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 201,
        "created_at": "2024-12-11T17:03:30.311664+00:00",
        "firstName": "Anastasia",
        "lastName": "Oster",
        "email": "anastasiaoster@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 202,
        "created_at": "2024-12-11T17:19:35.247018+00:00",
        "firstName": "Beate",
        "lastName": "Fürst",
        "email": "b.fuerst07@gmail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 203,
        "created_at": "2024-12-11T18:06:54.802745+00:00",
        "firstName": "Nicole",
        "lastName": "Maier",
        "email": "nicole_maier19@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 204,
        "created_at": "2024-12-11T20:18:22.550346+00:00",
        "firstName": "Elena",
        "lastName": "Heinzmann",
        "email": "elena.laura.heinzmann@web.de",
        "persons": 3,
        "questions": "Kann auch sein, dass es eine Person mehr/weniger sein wird.",
        "active": true
    },
    {
        "id": 205,
        "created_at": "2024-12-11T23:23:59.840149+00:00",
        "firstName": "Jan",
        "lastName": "Kruske",
        "email": "jankruske@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 206,
        "created_at": "2024-12-12T08:19:38.131166+00:00",
        "firstName": "Elias",
        "lastName": "Langlitz",
        "email": "eliaslanglitz30@gmail.com",
        "persons": 9,
        "questions": "4 kinder",
        "active": true
    },
    {
        "id": 208,
        "created_at": "2024-12-12T11:58:22.049535+00:00",
        "firstName": "Reinhold",
        "lastName": "Eckstädt",
        "email": "r.eckstaedt@gmail.com",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 209,
        "created_at": "2024-12-12T13:03:01.554345+00:00",
        "firstName": "Barbara",
        "lastName": "Reinhard",
        "email": "barbara.reinhard@abbvie.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 210,
        "created_at": "2024-12-12T16:02:50.25468+00:00",
        "firstName": "Michael",
        "lastName": "Richert",
        "email": "michael_richert@gmx.de",
        "persons": 8,
        "questions": "",
        "active": true
    },
    {
        "id": 211,
        "created_at": "2024-12-12T16:29:41.486151+00:00",
        "firstName": "Eugen",
        "lastName": "Drews",
        "email": "eugen-drews@hotmail.de",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 212,
        "created_at": "2024-12-12T18:12:50.195247+00:00",
        "firstName": "Ljuba",
        "lastName": "Hornus",
        "email": "familyhornus@gmx.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 214,
        "created_at": "2024-12-12T19:54:51.932239+00:00",
        "firstName": "Maria",
        "lastName": "erz",
        "email": "m.erz87@web.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 215,
        "created_at": "2024-12-12T20:09:17.535439+00:00",
        "firstName": "Luca",
        "lastName": "Jeske",
        "email": "jeskeluca@gmail.com",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 216,
        "created_at": "2024-12-12T20:19:08.548876+00:00",
        "firstName": "Nelli",
        "lastName": "Steinbrenner",
        "email": "asteinbrenner@gmx.de",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 217,
        "created_at": "2024-12-12T20:59:01.777809+00:00",
        "firstName": "Elvira",
        "lastName": " Grün",
        "email": "elvira.gruen@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 218,
        "created_at": "2024-12-12T21:26:56.488796+00:00",
        "firstName": "Lea",
        "lastName": "Spitzer",
        "email": "leaspitzer15@web.de",
        "persons": 5,
        "questions": "",
        "active": true
    },
];

const first = [
    {
        "id": 219,
        "created_at": "2024-12-12T21:34:06.456217+00:00",
        "firstName": "Ralf",
        "lastName": "Lafera",
        "email": "lafera.ralf@web.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 220,
        "created_at": "2024-12-13T00:41:09.427883+00:00",
        "firstName": "Renate",
        "lastName": "König",
        "email": "renatekonig@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 221,
        "created_at": "2024-12-13T08:17:01.017853+00:00",
        "firstName": "Gigi",
        "lastName": "Nowak",
        "email": "gigi.nowak@gmx.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 222,
        "created_at": "2024-12-13T08:18:01.449331+00:00",
        "firstName": "Merkel",
        "lastName": "Swetlana",
        "email": "andreas-merkel@gmx.de",
        "persons": 4,
        "questions": "Personen zwischen 3-4",
        "active": true
    },
    {
        "id": 223,
        "created_at": "2024-12-13T08:27:45.771106+00:00",
        "firstName": "ida",
        "lastName": "kussmaul",
        "email": "idakuss85@gmail.com",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 225,
        "created_at": "2024-12-13T09:56:04.574923+00:00",
        "firstName": "waldemar",
        "lastName": "König",
        "email": "irinakoenig@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 227,
        "created_at": "2024-12-13T10:36:53.255346+00:00",
        "firstName": "Heidrun",
        "lastName": "Arnold",
        "email": "enricoanselm0707@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 228,
        "created_at": "2024-12-13T11:26:15.346767+00:00",
        "firstName": "Karl",
        "lastName": "Kirchhöfer",
        "email": "karlolgakirch@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
];

const mailsToSend = [
    {
        "id": 229,
        "created_at": "2024-12-13T11:29:27.799507+00:00",
        "firstName": "Paul",
        "lastName": "Fast",
        "email": "spafa@web.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 230,
        "created_at": "2024-12-13T11:36:51.745917+00:00",
        "firstName": "Daniel",
        "lastName": "Lech",
        "email": "Lech_Daniel@yahoo.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 232,
        "created_at": "2024-12-13T14:19:52.698458+00:00",
        "firstName": "Eugen",
        "lastName": "Korbmacher",
        "email": "eugen.marketing8@gmail.com",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 233,
        "created_at": "2024-12-13T15:50:59.864897+00:00",
        "firstName": "Albert",
        "lastName": "Bohle",
        "email": "albert.bohle@gmx.de",
        "persons": 5,
        "questions": "",
        "active": true
    },
    {
        "id": 234,
        "created_at": "2024-12-13T16:25:08.481434+00:00",
        "firstName": "Sophia",
        "lastName": "Peno",
        "email": "sophiafast29@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 235,
        "created_at": "2024-12-13T16:56:58.822196+00:00",
        "firstName": "anita & julia",
        "lastName": "siebert",
        "email": "anitasiebert63@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 236,
        "created_at": "2024-12-13T17:37:02.329069+00:00",
        "firstName": "Anke",
        "lastName": "Illg",
        "email": "illg_anke@web.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 237,
        "created_at": "2024-12-13T20:25:11.911071+00:00",
        "firstName": "Steven",
        "lastName": "Kuntz",
        "email": "sjk@web.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 239,
        "created_at": "2024-12-13T20:38:28.622958+00:00",
        "firstName": "nico",
        "lastName": "siebert",
        "email": "siebertnico04@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 240,
        "created_at": "2024-12-13T21:52:05.622645+00:00",
        "firstName": "Nelli",
        "lastName": "Dalinger",
        "email": "Dalingernelli@gmail.com",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 241,
        "created_at": "2024-12-13T22:48:29.687856+00:00",
        "firstName": "daniel",
        "lastName": "neumamn",
        "email": "daniel.ne1402@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 242,
        "created_at": "2024-12-13T23:05:35.401398+00:00",
        "firstName": "Waldemar",
        "lastName": "Becker",
        "email": "waldemar_becker@yahoo.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 243,
        "created_at": "2024-12-14T07:18:10.869519+00:00",
        "firstName": "Fast",
        "lastName": "Alex",
        "email": "alexfast@gmx.de",
        "persons": 4,
        "questions": "",
        "active": true
    },
    {
        "id": 244,
        "created_at": "2024-12-14T10:16:36.187901+00:00",
        "firstName": "Simon",
        "lastName": "Roth",
        "email": "simon.roth.04@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 245,
        "created_at": "2024-12-14T10:27:32.178889+00:00",
        "firstName": "Andreas",
        "lastName": "Schmidt",
        "email": "andischmidt24071992@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 246,
        "created_at": "2024-12-14T10:27:57.889008+00:00",
        "firstName": "rudolf",
        "lastName": "witmaier",
        "email": "rudolfwitmaier01@gmx.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 247,
        "created_at": "2024-12-14T10:33:56.007742+00:00",
        "firstName": "Alexander",
        "lastName": "Gesswein",
        "email": "agesswein@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 248,
        "created_at": "2024-12-14T10:38:50.558213+00:00",
        "firstName": "Robert",
        "lastName": "Roth",
        "email": "alinaroth11@gmail.com",
        "persons": 6,
        "questions": "",
        "active": true
    },
    {
        "id": 249,
        "created_at": "2024-12-14T10:43:45.719614+00:00",
        "firstName": "Dina",
        "lastName": "Kronwald",
        "email": "kron83@hotmail.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 250,
        "created_at": "2024-12-14T10:48:22.81226+00:00",
        "firstName": "Jürgen",
        "lastName": "Schranz",
        "email": "juergen.schranz@t-online.de",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 251,
        "created_at": "2024-12-14T11:20:39.741371+00:00",
        "firstName": "lilly",
        "lastName": "dumitsch",
        "email": "l.dumitsch@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 252,
        "created_at": "2024-12-14T11:55:02.414085+00:00",
        "firstName": "andy",
        "lastName": "neufeld",
        "email": "andynufeld7@gmail.com",
        "persons": 8,
        "questions": "",
        "active": true
    },
    {
        "id": 253,
        "created_at": "2024-12-14T12:21:55.217778+00:00",
        "firstName": "ida",
        "lastName": "eckstädt",
        "email": "selinwitmaier01@gmx.de",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 254,
        "created_at": "2024-12-14T13:13:45.269406+00:00",
        "firstName": "Anna",
        "lastName": "Kunz",
        "email": "annakunz80@googlemail.com",
        "persons": 3,
        "questions": "",
        "active": true
    },
    {
        "id": 255,
        "created_at": "2024-12-14T14:00:13.763321+00:00",
        "firstName": "Noël",
        "lastName": "Dittrich",
        "email": "dittrichnoel8@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 256,
        "created_at": "2024-12-14T14:02:01.8861+00:00",
        "firstName": "Edward",
        "lastName": "Berg",
        "email": "bergh7919@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 257,
        "created_at": "2024-12-14T14:29:52.00549+00:00",
        "firstName": "Marc",
        "lastName": "Becker",
        "email": "hugob7515@gmail.com",
        "persons": 1,
        "questions": "",
        "active": true
    },
    {
        "id": 258,
        "created_at": "2024-12-14T14:30:51.304935+00:00",
        "firstName": "Marina",
        "lastName": "Steinbrenner",
        "email": "maristeini@gmx.net",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 259,
        "created_at": "2024-12-14T14:59:41.019513+00:00",
        "firstName": "Matthias",
        "lastName": "Klimm",
        "email": "m_klimm@web.de",
        "persons": 2,
        "questions": "",
        "active": true
    },
    {
        "id": 260,
        "created_at": "2024-12-14T15:34:54.865058+00:00",
        "firstName": "Judith",
        "lastName": "Klimm",
        "email": "judith.klimm@gmail.com",
        "persons": 2,
        "questions": "",
        "active": true
    }
];
