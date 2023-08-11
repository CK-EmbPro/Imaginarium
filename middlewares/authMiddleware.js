const Client = require('../models/clientScheme')
const jwt = require('jsonwebtoken')

const checkUser = (req, res, next)=>{

    const token = req.cookies.jwtToken

    console.log("jwtToken in request are: ",token)

    // check json web token exists& verified
    if(token){
        jwt.verify(token, 'user-is-authenticated', async(err, decodedToken)=>{
            if(err){
                console.error(err.message);
                res.locals.jwtToken = null
               next()

            }else{
               console.log(decodedToken)
               let user = await Client.findById(decodedToken.id)
               res.locals.jwtToken = token
               next()
            }
        })
    }else{
      
       next()
    }

  
}


module.exports  = checkUser