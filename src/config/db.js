const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'rest_api_db',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    connectionTimeoutMillis: 2000
};

let pool = null;

const getConnection = async () => {
    try {
        if (!pool) {
            pool = new Pool(dbConfig);
        }
        // Verificar conexión
        const client = await pool.connect();
        client.release();
        return pool;
    } catch (error) {
        console.warn('PostgreSQL no disponible en la conexión:', error.message);
        throw error;
    }
};

module.exports = {
    Pool,
    getConnection,
    dbConfig
};