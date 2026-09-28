const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const initialRoutes = require('./src/routes/initial.routes');
const usersRoutes = require('./src/routes/users.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/', initialRoutes);
app.use('/', usersRoutes);

// Middleware para manejar 404 (Ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
  });
}

module.exports = app;
