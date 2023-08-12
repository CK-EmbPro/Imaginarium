const express = require('express')
const reservationController = require('../controllers/book')
const router = express.Router();
//retrieve all reserved places
router.get('/', reservationController.retrieveAll)

router.get('/booking', (req,res)=>{
    res.render('booking.ejs')
})

router.get('/about', (req, res)=>{
    res.render('about.ejs')
})
//reserve a place
router.post('/booking/reserve', reservationController.reservePlace)
router.delete('/:id', reservationController.cancel)
module.exports = router