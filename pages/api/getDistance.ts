import { Dayjs } from "dayjs";

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
    const { lat, long } = req.body;
    const response: Response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${lat},${long}&origins=49.331680,8.423990&key=${process.env.GOOGLE_API_KEY}`);

    if (response.status === 200) {
        const data = await response.json();
        const distance: number = Math.round(data.rows[0].elements[0].distance.value / 1000);
        res.status(200).end(JSON.stringify({ distance, success: true }));
        return;
    }

    console.log(Dayjs);

    res.status(200).end(JSON.stringify({ success: false }));
    return;
}

module.exports = allowCors(handler);