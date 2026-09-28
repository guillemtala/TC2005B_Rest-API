const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'rest_api_db',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool = null;

const getConnection = async() => {
    try {
        if (pool) {
            return pool;
        }
        pool = await sql.connect(dbConfig);
        console.log('Conexión exitosa a MSSQL Database:', dbConfig.database);
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos MSSQL:', error.message);
        throw error;
    }
};

module.exports = {
    sql,
    getConnection
};