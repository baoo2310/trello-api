import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB, GET_DB } from './config/db.js';
import { env } from './config/environment.js';
import { APIs_V1 } from './routes/v1/index.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { corsOptions } from './config/cors.js';

const PORT = env.PORT || 3000;
const HOST = env.DB_HOST || 'localhost';

export const START_SERVER = async () => {
    const app = express();

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use('/v1', APIs_V1);
    app.use(errorHandlingMiddleware);

    app.get('/', function (req, res)  {
        res.send('<h1>Hello World</h1>');
    });

    app.get('/health', async function (req, res) {
        try {
            await GET_DB().query('SELECT 1');
            res.json({ ok: true });
        } catch (err) {
            console.error('Health check DB error:', err);
            res.status(500).json({ ok: false, error: 'db_unreachable' });
        }
    });

    app.listen(PORT, HOST, () => {
        console.log(`Server is running at http://${HOST}:${PORT}/`);
    });

    exitHook(() => {
        CLOSE_DB();
    });
};

CONNECT_DB()
    .then(() => START_SERVER())
    .catch(err => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });