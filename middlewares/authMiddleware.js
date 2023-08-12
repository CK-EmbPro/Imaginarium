const Client = require('../models/clientScheme')
const jwt = require('jsonwebtoken')

const checkUser = (req, res, next)=>{//what it does it checks if the user has signed up or logged in then after it sets the global variable of his/her data for not

    const token = req.cookies.jwtToken

   

    // check json web token exists& verified
    if(token){
        jwt.verify(token, 'user-is-authenticated', async(err, decodedToken)=>{
            if(err){
                console.error(err.message);
                res.locals.user = null
               next()

            }else{
               console.log(decodedToken)
               let user = await Client.findById(decodedToken.id)
               res.locals.user = user
               next()
            }
        })
    }else{
      
       next()
    }

  
}


const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwtToken

    console.log("the token is", token)

    // check json web token exists& verified
    if(token){
        jwt.verify(token, 'user-is-authenticated', (err, decodedToken)=>{
            if(err){
                console.error(err.message);
                res.redirect('/client/login')

            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/client/login');
    }
  
}


module.exports = {checkUser, requireAuth}