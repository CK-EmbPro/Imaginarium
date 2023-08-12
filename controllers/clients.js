const Client = require('../models/clientScheme')
const ContactSchema = require('../models/ContactShema')
const jwt = require('jsonwebtoken')

const handleSignUpErrors = (err) => {

     const errors = {
          emailError: '',
          passwordError: '',
          telNumberError: '',
     }


     // Incorrect email
     if (err.message === 'incorrect email') {
          errors.email = 'that email is not registered'
     }

     // Incorrect password

     if (err.message === 'incorrect password') {
          errors.password = "that password is not correct"
     }

     if (err.code === 11000) {
          errors.emailError = "Email address already exists"
     }

     if (err.message.includes('client validation failed')) {

          const errorMessages = err.message.replace('client validation failed:', '').split(',');

          errorMessages.forEach(errorMessage => {
               if (errorMessage.includes('email:')) {
                    const email_error = errorMessage.split(':')[1].trim();
                    errors.emailError = email_error;
               }

               if (errorMessage.includes('phoneNumber:')) {
                    const tel_error = errorMessage.split(':')[1].trim();
                    errors.telNumberError = tel_error;
               }

               if (errorMessage.includes('password:')) {
                    const password_error = errorMessage.split(':')[1].trim();
                    errors.passwordError = password_error;
               }
          });

          return errors;
     }

     return errors;
}

const handleLoginErrors = (err) => {
     console.log(err.message, err.code);
     let errors = { emailError: '', passwordError: '' }

     // Incorrect email
     if (err.message === 'Incorrect email') {
          errors.emailError = 'that email is not registered'
     }

     // Incorrect password

     if (err.message === 'Incorrect password') {
          errors.passwordError = "that password is not correct"
     }


     // validation errors

     // if(err.message.includes('user validation failed')){
     //     console.log(Object.values(err.errors).forEach(({properties}) => {
     //         errors[properties.path] = properties.message
     //     }))
     // }

     return errors;
}

maxAge = 60 * 5
const createToken = (id) => {
     return (jwt.sign({ id }, "user-is-authenticated", { expiresIn: 60 * 60 }))
}

exports.addClient = async (req, res) => {
     const { name, email, phoneNumber, password } = req.body
     try {
          const client = new Client({
               name, email, phoneNumber, password
          })


          await client.save()
               .then((data) => {
                    console.log(data)
                    const { _id } = data
                    const jwtToken = createToken(_id)

                    res.cookie("jwtToken", jwtToken, {
                         maxAge: 1000 * 60 * 60,
                         httpOnly: true,
                    })

                    res.json(data)
               })
               .catch((err) => {
                    console.log(err.message)
                    const errors = handleSignUpErrors(err)
                    res.send(errors)
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


exports.loginHandler = async function (req, res) {

     try {
          const { email, password } = req.body;

          console.log(email, password);
          const user = await Client.login(email, password)
          console.log(user)
          const token = createToken(user._id)
          res.cookie('jwtToken', token, {
               httpOnly: true,
               maxAge: maxAge * 1000
          })
          res.status(200).json({ user: user._id })
     } catch (error) {
          const errors = handleLoginErrors(error);
          res.status(400).json(errors);
     }

}

exports.loginPage = (req, res) => {
     res.render('login.ejs')
}

exports.signUpPage = async (req, res) => {
     res.render('signup.ejs')
}



exports.signUpPage = async (req, res) => {
     res.render('signup.ejs')
}

exports.userProfilePage = async (req, res) => {
     res.render('about.ejs')
}

