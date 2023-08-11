const Client = require('../models/clientScheme')
const ContactSchema = require('../models/ContactShema')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
     console.log(err.message, err.code);
   
     const errors = {
       email: '',
       password: '',
       telNumber: '',
     }
   
     if (err.message.includes('client validation failed')) {

     const errorMessages = err.message.replace('client validation failed:', '').split(',');
   
       errorMessages.forEach(errorMessage => {
         if (errorMessage.includes('email:')) {
           const email_error = errorMessage.split(':')[1].trim();
           errors.email = email_error;
         }
   
         if (errorMessage.includes('phoneNumber:')) {
           const tel_error = errorMessage.split(':')[1].trim();
           errors.telNumber = tel_error;
         }
   
         if (errorMessage.includes('password:')) {
           const password_error = errorMessage.split(':')[1].trim();
           errors.password = password_error;
         }
       });
   
       return errors;
     }
   
     return errors;
   }
   
maxAge = 60*60
const createToken = (id)=>{
    return (jwt.sign({id}, "user-is-authenticated", {expiresIn: 60*60}))
}

exports.addClient = async (req, res) => {
     const {name, email, phoneNumber, password} = req.body
     try {
          const client = new Client({
               name, email, phoneNumber, password
          })

          
      await client.save()
          .then((data)=>{
               console.log(data)
               const {_id} = data
               const jwtToken = createToken(_id)
               
               res.cookie("jwtToken", jwtToken, {
                    maxAge: 1000*60*60,
                    httpOnly: true,
               })

               res.json(data)
          })
          .catch((err)=>{
               console.log(err.message)
               const errors = handleErrors(err)
               res.json(errors)
          })
         

     } catch (error) {
        console.error(error)
     }


}

exports.findAll = async (req, res) => {
     try {
          const clients = await client.find()
          res.status(200).json(clients)
     }
     catch (err) {
          res.status(404).send(err)
     }
}

exports.findOne = async (req, res) => {
     try {
          const user = await client.findById(req.params.id);
          res.status(200).json(user);
     } catch (error) {
          res.status(404).json({ message: error.message });
     }
}

exports.update = async (req, res) => {
     const id = req.params.id;

     await client.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then(data => {
               if (!data) {
                    res.status(404).send({
                         message: `User not found.`
                    });
               } else {
                    res.send({
                         message: "User updated successfully."
                    })
                    console.log("User updated successfully.");
               }
          }).catch(err => {
               res.status(500).send({
                    message: err.message
               });
          });
}

exports.remove = async (req, res) => {
     await client.findByIdAndRemove(req.params.id)
          .then(data => {
               if (!data) {
                    res.status(404).send({
                         message: `User not found.`
                    });
               } else {
                    res.send({
                         message: "User deleted successfully!"
                    });
               }
          }).catch(err => {
               res.status(500).send({
                    message: err.message
               });
          });
};


exports.loginHandler = async (req, res) => {
     console.log(req.body.email)
     await client.find({email: req.body.email})
     .then(data=>{
          console.log(data)
          console.log(data[0].password)
          if(data[0].password === req.body.password) {
               res.redirect('/book/booking');
          }else{
               res.send("Oh!! no the credentials don't match")
          }
     })
}

exports.loginPage= (req, res) => {
     res.render('login.ejs')
}

exports.signUpPage = async( req,res ) => {
     res.render('signup.ejs')
}

exports.contactPage = async( req,res ) => {
     res.render('contactUs.ejs')
}

exports.signUpPage = async( req,res ) => {
     res.render('signup.ejs')
}

exports.userProfilePage = async( req,res ) => {
     res.render('about.ejs')
}


module.exports.contactHandler = async (req, res)=>{
    try {
        
   
    const {name, email, phoneNumber, companyName, serviceName, currLocation, message} = req.body
    const contactData = new ContactSchema({
        name, 
        email,
        phoneNumber,
        serviceName,
        companyName,        
        currLocation,
        message,
    })

    await contactData.save()
    .then((data)=>{
        res.redirect('/client/contact')
    })

    .catch(err=> res.status(400).render())

} catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message})
}
}