var express = require('express');
const userController = require('../controllers/user.controller');
var router = express.Router();

// UC-201 Registreren als nieuwe user
router.post('', userController.createUser);

/* GET users listing. */

// UC-202 Opvragen overzicht van users
router.get('', userController.getAllUsers);

// UC-204 Opvragen van usergegevens bij ID
router.get('/:userId', userController.getOneUser);

// UC-205 Updaten van usergegevens
// router.post('', userController.updateUser);

router.get('/:userId/inactivate', userController.inactivateUser);

// UC-206 Verwijderen van user
router.post('/:userId/delete', userController.deleteUser);

module.exports = router;
