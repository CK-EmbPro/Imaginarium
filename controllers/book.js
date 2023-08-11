const Reservation = require('../models/reservationScheme')

const handleErrors = (err) => {
     console.log(err.message, err.code);
     let errors = {email: '', password: ''}
 
     // Incorrect email
     if(err.message === 'incorrect email'){
         errors.email = 'that email is not registered'
     }
 
     // Incorrect password
 
     if(err.message === 'incorrect password'){
         errors.password = "that password is not correct"
     }
 
     // duplication errors
     if(err.code === 11000){
         errors.email = "Email already exists!"
     }
     
     // validation errors
 
     if(err.message.includes('user validation failed')){
         console.log(Object.values(err.errors).forEach(({properties}) => {
             errors[properties.path] = properties.message
         }))
     }
 
     return errors;
 }
exports.reservePlace = async (req, res) =>{
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
     res.redirect('/book/userProfile')
          
        
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