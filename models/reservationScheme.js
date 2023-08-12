const mongoose = require("mongoose")
const ReserveSchema= new mongoose.Schema({
     email: {
          type: String,
          required: true,
          
     },
     numberOfPeople: {
          type: Number,
          required: true
     },
     destination: {
          type: String,
          required: true
     },
     time: {
          type: Date,
          required: true
     },
     details: {
          type: String,
          required: false
     }
})

module.exports = mongoose.model('Reservation', ReserveSchema)
