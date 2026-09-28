const { Router } = require('express');
const { getHome, getMarco, getPing } = require('../controllers/initial.controller');

const router = Router();

router.get('/', getHome);
router.get('/marco', getMarco);
router.get('/ping', getPing);

module.exports = router;
