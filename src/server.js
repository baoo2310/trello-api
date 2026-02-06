import express from 'express';
import pool from '~/config/db.js';

const app = express();
const hostname = 'localhost';
const port = 8017;

app.use(express.json());

app.get('/', function (req, res)  {
    res.send('<h1>Hello World</h1>');
});

app.get('/health', async function (req, res) {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: 'db_unreachable' });
    }
});

app.listen(port, hostname, () => {
    console.log(`Server is runninng at port http://${hostname}:${port}/`);
});