-- Script para la creación de la base de datos y la tabla de usuarios en PostgreSQL

-- 1. Crear la base de datos (Ejecutar de forma independiente si no existe):
-- CREATE DATABASE rest_api_db;

-- 2. Conectarse a la base de datos y crear la tabla Users:
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar datos de prueba iniciales
INSERT INTO users (username, email, password, role)
VALUES 
    ('admin', 'admin@example.com', 'admin123', 'admin'),
    ('juan', 'juan@example.com', 'juan123', 'user'),
    ('maria', 'maria@example.com', 'maria123', 'user')
ON CONFLICT (username) DO NOTHING;
