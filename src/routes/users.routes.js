const { Router } = require('express');
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} = require('../controllers/users.controller');

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


router.post('/login', loginUser);

module.exports = router;