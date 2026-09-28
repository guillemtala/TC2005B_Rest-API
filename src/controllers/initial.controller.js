// Controlador para rutas iniciales: /, /marco, /ping

const getHome = (req, res) => {
  res.json({
    message: 'Bienvenido a la REST API',
    status: 'online',
    endpoints: {
      initial: ['/', '/marco', '/ping'],
      users: ['GET /users', 'GET /users/:id', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'],
      auth: ['POST /login']
    }
  });
};

const getMarco = (req, res) => {
  res.send('polo');
};

const getPing = (req, res) => {
  res.send('pong');
};

module.exports = {
  getHome,
  getMarco,
  getPing
};
