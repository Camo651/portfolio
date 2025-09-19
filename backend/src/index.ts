import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { initApp } from './app';

const start = async () => {
    const app = await initApp();
    app.listen(process.env.API_PORT, () => {
        console.log(`Server started on port ${process.env.API_PORT}`);
    });
};
start();
