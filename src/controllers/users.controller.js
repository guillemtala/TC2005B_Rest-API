const { getConnection } = require('../config/db');

// Datos simulados (mock) para fallback cuando PostgreSQL no está conectado
let mockUsers = [
    { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin', created_at: new Date() },
    { id: 2, username: 'juan', email: 'juan@example.com', password: 'juan123', role: 'user', created_at: new Date() },
    { id: 3, username: 'maria', email: 'maria@example.com', password: 'maria123', role: 'user', created_at: new Date() }
];
let nextMockId = 4;

// 1. Obtener todos los usuarios (READ)
const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY id ASC');
        return res.json({ status: 'success', data: result.rows });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para GET /users:', error.message);
        const sanitizedUsers = mockUsers.map(({ password, ...user }) => user);
        return res.json({ status: 'success (mock)', data: sanitizedUsers });
    }
};

// 2. Obtener un usuario por ID (READ)
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        return res.json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para GET /users/:id:', error.message);
        const user = mockUsers.find(u => u.id === parseInt(id, 10));
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        const { password, ...sanitizedUser } = user;
        return res.json({ status: 'success (mock)', data: sanitizedUser });
    }
};

// 3. Crear un usuario (CREATE)
const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Por favor proporcione username, email y password'
        });
    }

    const userRole = role || 'user';

    try {
        const pool = await getConnection();
        const result = await pool.query(
            `INSERT INTO users (username, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, role, created_at`,
            [username, email, password, userRole]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Usuario creado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para POST /users:', error.message);
        const existing = mockUsers.find(u => u.username === username || u.email === email);
        if (existing) {
            return res.status(400).json({ status: 'error', message: 'El usuario o email ya existe' });
        }
        const newUser = {
            id: nextMockId++,
            username,
            email,
            password,
            role: userRole,
            created_at: new Date()
        };
        mockUsers.push(newUser);
        const { password: pwd, ...sanitizedNewUser } = newUser;
        return res.status(201).json({
            status: 'success (mock)',
            message: 'Usuario creado exitosamente',
            data: sanitizedNewUser
        });
    }
};

// 4. Actualizar un usuario (UPDATE)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    try {
        const pool = await getConnection();

        const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (checkUser.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const currentUser = checkUser.rows[0];
        const newUsername = username || currentUser.username;
        const newEmail = email || currentUser.email;
        const newPassword = password || currentUser.password;
        const newRole = role || currentUser.role;

        const result = await pool.query(
            `UPDATE users
             SET username = $1, email = $2, password = $3, role = $4
             WHERE id = $5
             RETURNING id, username, email, role, created_at`,
            [newUsername, newEmail, newPassword, newRole, id]
        );

        return res.json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para PUT /users/:id:', error.message);
        const index = mockUsers.findIndex(u => u.id === parseInt(id, 10));
        if (index === -1) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        mockUsers[index] = {
            ...mockUsers[index],
            username: username || mockUsers[index].username,
            email: email || mockUsers[index].email,
            password: password || mockUsers[index].password,
            role: role || mockUsers[index].role
        };

        const { password: pwd, ...sanitizedUpdatedUser } = mockUsers[index];
        return res.json({
            status: 'success (mock)',
            message: 'Usuario actualizado exitosamente',
            data: sanitizedUpdatedUser
        });
    }
};

// 5. Eliminar un usuario (DELETE)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        return res.json({
            status: 'success',
            message: `Usuario con ID ${id} eliminado exitosamente`
        });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para DELETE /users/:id:', error.message);
        const index = mockUsers.findIndex(u => u.id === parseInt(id, 10));
        if (index === -1) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        mockUsers.splice(index, 1);
        return res.json({
            status: 'success (mock)',
            message: `Usuario con ID ${id} eliminado exitosamente`
        });
    }
};

// 6. Iniciar sesión de usuario (AUTH)
const loginUser = async (req, res) => {
    const { login, email, username, password } = req.body;
    const userIdentifier = login || email || username;

    if (!userIdentifier || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Por favor ingrese su usuario/email y contraseña'
        });
    }

    try {
        const pool = await getConnection();
        const result = await pool.query(
            `SELECT id, username, email, role, created_at
             FROM users
             WHERE (email = $1 OR username = $1)
               AND password = $2`,
            [userIdentifier, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        return res.json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            user: result.rows[0]
        });
    } catch (error) {
        console.warn('PostgreSQL no disponible, usando fallback local para POST /login:', error.message);
        const user = mockUsers.find(
            u => (u.email === userIdentifier || u.username === userIdentifier) && u.password === password
        );

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        const { password: pwd, ...sanitizedUser } = user;
        return res.json({
            status: 'success (mock)',
            message: 'Inicio de sesión exitoso',
            user: sanitizedUser
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};