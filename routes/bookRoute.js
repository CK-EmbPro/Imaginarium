const express = require('express')
const reservationController = require('../controllers/book')
const clientController = require('../controllers/clients')
const authMiddleware = require('../middlewares/authMiddleware');
 const router = express.Router();
//retrieve all reserved places
router.get('/', reservationController.retrieveAll)

router.get('/booking',authMiddleware.requireAuth, (req,res)=>{
    res.render('booking.ejs')
})

router.get('/about',authMiddleware.requireAuth, (req, res)=>{
    res.render('about.ejs')
})
//reserve a place
router.post('/booking/reserve', reservationController.reservePlace)
router.delete('/:id', reservationController.cancel)
router.get('/contact',authMiddleware.requireAuth, reservationController.contactPage )

router.post('/addContact', reservationController.contactHandler)
module.exports = router