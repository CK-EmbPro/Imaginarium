const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {isEmail} = require('validator')

const clientScheme = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true,
          unique: true,
          validate: [isEmail, "Please enter a valid email address"]
     },
     phoneNumber: {
          type: String,
          required: true,
          maxLength: [10, "Please enter a valid Rwandan phone number"],
          minLength: [10, "Please enter a valid Rwandan phone number"],
         
     },
     password: {
          type: String,
          required: true,
          minLength: [6, "password length is less than the requried(6)"],
          maxLength: [20, "password length is greater than the requried(20)"],
     }
})

clientScheme.pre('save', async function(next){
     const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

clientScheme.statics.login = async function (email, password){
     const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){ // To mean if pre-hashed password matches with stored password
            return user
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}
const client =mongoose.model("client", clientScheme)
module.exports = client