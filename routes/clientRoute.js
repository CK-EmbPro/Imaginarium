const express = require('express')
const clientController = require('../controllers/clients')
const router = express.Router();


router.get('/signUp', clientController.signUpPage)
router.get('/login',clientController.loginPage)
router.get('/', clientController.findAll)
router.get('/:id', clientController.findOne)
router.post('/login/signin', clientController.loginHandler)
router.post('/addClient', clientController.addClient)
router.put('/:id', clientController.update)
router.delete('/:id', clientController.remove)

module.exports = router