const jwt = require('jsonwebtoken')
const User = require('../models/user')


const check = async(req,res,next)=>{
    const token = req.header('Authorization').split(' ')[1]
    const payload = jwt.verify(token,'topsecret')
    try {
    const valid_user = await User.findOne({_id:payload.id,'tokens.token':token}) 
    if(!valid_user){
       return res.status(401).json({
            err : "Token expired, Auth failed"
        })
    }
    req.userid = payload.id
    req.user = valid_user
    console.log(valid_user)
    next()
    } catch(err){
        console.log(err)
        res.status(401).json({
            err : "Server side error"
        })
    }
    
}

module.exports = check;