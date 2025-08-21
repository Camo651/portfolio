import express from 'express';
import { track, TrackerModelType } from './tracker';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.status(200).send('Matt Hagger API');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    const body = req.body as Partial<TrackerModelType>;
    try {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ip = Array.isArray(ip) ? ip[0] : ip;
        const userAgent = req.headers['user-agent'];
        await track({ ...body, ip, userAgent });
        res.sendStatus(204);
    } catch (e: any) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
});

export default router;
