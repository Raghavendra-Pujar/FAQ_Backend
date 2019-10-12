const mongoose = require('mongoose');
const token = require('../libs/tokenLib')
const check = require('../libs/checkLib');
const response = require('../libs/responseLib');
const AuthModel = mongoose.model('Auth');

let login = (req,res)=>{

  
    let validateAdmin = (req,res) =>{
        return new Promise((resolve,reject)=>{
            if(req.body.userName === "admin"){
                if(req.body.password === "admin"){

                   

                    token.generateToken(req.body.userName,(err,tokenDetails)=>{
                        if (err) {
                            console.log(err)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            tokenDetails.userName = req.body.userName
                          //  tokenDetails.userDetails = userDetails
                            resolve(tokenDetails)
                        }
                    })
                }else{
                    let apiResponse = response.generate(true,'Password invalid',400,null);
                    reject(apiResponse);
                }
            }else{
                let apiResponse = response.generate(true,'UserName invalid',400,null);
                reject(apiResponse);
            }
        })
    }



        let saveToken = (tokenDetails) => {
            console.log("save token");
            return new Promise((resolve, reject) => {
                AuthModel.findOne({ userName: tokenDetails.userName }, (err, retrievedTokenDetails) => {
                    if (err) {
                        console.log(err.message, 'userController: saveToken', 10)
                        let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedTokenDetails)) {
                        let newAuthToken = new AuthModel({
                            userName: tokenDetails.userId,
                            authToken: tokenDetails.token,
                            tokenSecret: tokenDetails.tokenSecret,
                        })
                        newAuthToken.save((err, newTokenDetails) => {
                            if (err) {
                                console.log(err)
                                let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                                reject(apiResponse)
                            } else {
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody)
                            }
                        })
                    } else {
                        retrievedTokenDetails.authToken = tokenDetails.token
                        retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                        retrievedTokenDetails.save((err, newTokenDetails) => {
                            if (err) {
                                console.log(err)
                                let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                                reject(apiResponse)
                            } else {
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody)
                            }
                        })
                    }
                })
            })
        }

        validateAdmin(req,res)
        .then(saveToken)
        .then((resolve)=>{
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        }).catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}


let logout = (req, res) => {
    AuthModel.findOneAndRemove({ userName: req.user.userName }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
}

module.exports={
    login:login,
    logout: logout
}
