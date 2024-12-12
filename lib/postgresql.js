import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: {
        rejectUnauthorized: false,
    }
});

// Verificar la conexión
pool.on('error', (err) => {
    console.error('Error inesperado del pool de PostgreSQL', err);
});

module.exports = pool; 