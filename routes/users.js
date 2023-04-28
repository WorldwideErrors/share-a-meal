var express = require('express');
const userController = require('../controllers/user.controller');
var router = express.Router();


/* POST users listing */
router.post('', userController.createUser);

/* GET users listing. */
router.get('', userController.getAllUsers);

router.get('/:userId', userController.getOneUser);

module.exports = router;
