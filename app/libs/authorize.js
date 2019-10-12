const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
//const request = require("request")
const Auth = mongoose.model('Auth')

const responseLib = require('./../libs/responseLib')
const token = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')

let isAuthorized = (req, res, next) => {
  

  if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
    Auth.findOne({authToken: req.header('authToken') || req.params.authToken || req.body.authToken || req.query.authToken}, (err, authDetails) => {
      if (err) {
        console.log(err)
        let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(authDetails)) {
        let apiResponse = responseLib.generate(true, 'Invalid Or Expired AuthorizationKey, Please Log in Again', 404, null)
        res.send(apiResponse)
      } else {
        token.verifyToken(authDetails.authToken,authDetails.tokenSecret,(err,decoded)=>{

            if(err){
                let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
                res.send(apiResponse)
            }
            else{
                
                req.userName = decoded.data;
                //console.log("User Deatils from Midddleware")
                //console.log(req.user);
                next()
            }


        });// end verify token
       
      }
    })
  } else {
    let apiResponse = responseLib.generate(true, 'AuthorizationToken Is Missing In Request', 400, null)
    res.send(apiResponse)
  }
}


module.exports = {
  isAuthorized: isAuthorized
}