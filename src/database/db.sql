-- Script para la creación de la base de datos y la tabla de usuarios en Microsoft SQL Server

-- Crear Base de Datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'rest_api_db')
BEGIN
    CREATE DATABASE rest_api_db;
END;
GO

USE rest_api_db;
GO

-- Crear Tabla Users
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at DATETIME DEFAULT GETDATE()
    );
END;
GO

-- Insertar datos de prueba iniciales
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin')
BEGIN
    INSERT INTO Users (username, email, password, role)
    VALUES 
    ('admin', 'admin@example.com', 'admin123', 'admin'),
    ('juan', 'juan@example.com', 'juan123', 'user'),
    ('maria', 'maria@example.com', 'maria123', 'user');
END;
GO
