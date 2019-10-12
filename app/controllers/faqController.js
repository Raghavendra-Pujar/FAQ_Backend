const mongoose = require('mongoose');
const faqModel = mongoose.model('FaqSchema');
const response = require('../libs/responseLib');
const check = require('../libs/checkLib');
const shortid = require('shortid');


//Authorization 




// function to create an faq
let createFaq = (req,res)=>{
    console.log(req.body.title);
    console.log('Enetered here')
    let validate = (req,res)=>{
        console.log('Entered in validate')
        return new Promise((resolve,reject)=>{
            if(check.isEmpty(req.body.title)){
                let apiResponse = response.generate(true,'Title is missing',404,null);
                console.log('Error in faqController.createFaq',apiResponse);
                reject(apiResponse)
            }else if(check.isEmpty(req.body.description)){
                let apiResponse = response.generate(true,'Description is missing',404,null);
                console.log('Error in faqController.createFaq',apiResponse);
                reject(apiResponse);
            }else{
                resolve(req)
            }
        })
    }

    let insertData = (req,res)=>{
        console.log('InsertData')
        console.log(req.body.title);
        return new Promise((resolve,reject)=>{
            let faqObject = new faqModel({
                faqId: shortid.generate(),
                title: req.body.title,
                description: req.body.description
            })
    
            faqObject.save((err,result)=>{
                if(err){
                let apiResponse = response.generate(true,'Database error, Please try again',500,null);
                console.log('Error in faqController.createFaq',apiResponse);
                reject(apiResponse);
                }else{
                    console.log(result);
                    resolve(result);
                }
            })
        })


    }

    validate(req,res).then(insertData)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'FAQ created successfully',200,resolve);
        res.send(apiResponse);
    }).catch((err)=>{
        res.send(err);
    })
}

let fetchListOfFaq = (req,res)=>{

    faqModel.find().exec((err,faqList)=>{
        if(err){
         let apiResponse = response.generate(true,'Database error',500,null);
         console.log('database error',apiResponse);
         res.send(apiResponse);
        }else if(check.isEmpty(faqList)){
         let apiResponse = response.generate(true,'FAQ Lists are empty',404,null);
         res.send(apiResponse);
        }else{
         let apiResponse = response.generate(true,'Lists of FAQ',200,faqList);
         res.send(apiResponse);
        }
    })
}

let deleteFaq = (req,res)=>{

    let checkFaq = (req,res)=>{
        console.log('Delete Check')
        return new Promise((resolve,reject)=>{
            faqModel.findOne({faqId:req.body.faqId}).exec((err,result)=>{
                if(err){
                    let apiResponse = response.generate(true,'Database error',500,null);
                    reject(apiResponse);
                }else if(check.isEmpty(result)){
                    let apiResponse = response.generate(true,'No Faq is found witn the given Id',404,null);
                    reject(apiResponse);
                }else{
                    resolve(req);
                }
            })
        })
    }

    let remove = (req,res)=>{
        return new Promise((resolve,reject)=>{
        faqModel.deleteOne({faqId:req.body.faqId}).exec((err,result)=>{
            if(err){
                let apiResponse = response.generate(true,'Database error',500,null);
                reject(apiResponse);
            }else {
                let apiResponse = response.generate(true,'Deleted Successfully',200,result);
                resolve(apiResponse);
            }
        })
    })

        
    }

    checkFaq(req,res)
        .then(remove)
        .then((resolve)=>{
            res.send(resolve);
        }).catch((err)=>{
            res.send(err);
        })
}


let editFaq = (req,res)=>{

    let checkFaq = (req,res)=>{
        console.log('Delete Check')
        return new Promise((resolve,reject)=>{
            faqModel.findOne({faqId:req.body.faqId}).exec((err,result)=>{
                if(err){
                    let apiResponse = response.generate(true,'Database error',500,null);
                    reject(apiResponse);
                }else if(check.isEmpty(result)){
                    let apiResponse = response.generate(true,'No Faq is found witn the given Id',404,null);
                    reject(apiResponse);
                }else{
                    resolve(result);
                }
            })
        })
    }


    let edit = (result) =>{
        return new Promise((resolve,reject)=>{
            result.title = req.body.title,
            result.description = req.body.description

        result.save((err,editedDetails)=>{
            if(err){
                let apiResponse = response.generate(true, 'Internal Server error', 500, null);
                reject(apiResponse);
            }else{
                let apiResponse = response.generate(false,'FAQ has been edited',200,editedDetails);
                resolve(apiResponse);
            }
        })
    })
    }

    checkFaq(req,res)
    .then(edit)
    .then((resolve)=>{
        res.send(resolve);
    }).catch((err)=>{
        res.send(err);
    })
}


let getFaqDetails = (req,res)=>{
        console.log('Delete Check')
            faqModel.findOne({faqId:req.body.faqId}).exec((err,result)=>{
                if(err){
                    let apiResponse = response.generate(true,'Database error',500,null);
                    res.send(apiResponse);
                }else if(check.isEmpty(result)){
                    let apiResponse = response.generate(true,'No Faq is found witn the given Id',404,null);
                    res.send(apiResponse);
                }else{
                    let apiResponse = response.generate(false,'Details found',200,result)
                    res.send(apiResponse);
                }
            })
        
    }


module.exports={
    createFaq: createFaq,
    fetchFaq: fetchListOfFaq,
    deleteFaq: deleteFaq,
    editFaq: editFaq,
    getFaqDetails: getFaqDetails
}