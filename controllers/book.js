const Reservation = require('../models/reservationScheme')

const handleErrors = (err) => {
     console.log(err.message, err.code);
     const errors= {error: ''}
     if (err.message.includes('Reservation validation failed')) {
          errors.error ="All fields are required"
    
     }
    
 
     return errors;
 }
exports.reservePlace = async (req, res) =>{
     console.log(req.body)
     const {email, destination, time, numberOfPeople, details} = req.body
     const newReservation = new Reservation({
          email,
          destination,
          time,
          numberOfPeople,
          details
     })
     await newReservation.save()
     .then(data =>{
     
     res.json(data);     
        
     }).catch(err =>{
          const errors = handleErrors(err)
          res.status(400).json(errors)
     })
}
exports.retrieveAll = async (req, res) =>{
     try {
          const reservations = await Reservation.find()
          res.status(200).json(reservations)
     }
     catch(err){
          res.status(404).send(err)
     }
}

exports.cancel = async (req, res) => {
     await Reservation.findByIdAndRemove(req.params.id)
          .then(data => {
               if (!data) {
                    res.status(404).send({
                         message: `The reservation doesn't exist.`
                    });
               } else {
                    res.send({
                         message: "The reservation has been cancelled successfully."
                    });
               }
          }).catch(err => {
               res.status(500).send({
                    message: err.message
               });
          });
};