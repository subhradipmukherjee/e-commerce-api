const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { response } = require("../../app");
const User = require('../models/user')
const check = require('../middleware/auth')

router.post('/signup', async(req,res,next)=>{
try {
      const result = await User.findOne({email:req.body.email});
      if(!result)
       {
         const user = new User(req.body) 
         const token = await user.authtoken()
         user.tokens = user.tokens.concat({token})
         const n_user = await user.save()
         if(!n_user){
            return res.status(401).json({
                 error : "registraton failed"
             })
         }
         const op = {
             _id : n_user._id,
             name : n_user.name,
             email : n_user.email,
             cart : n_user.cart,
             token,
             Msg : "Sucessfully registered"

         }
         res.status(201).json(op)
        } else {
          res.status(401).json({error : "Email id already exists"})      
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
        error : "Server error"
      })
    }
  
})


router.post('/login',async(req,res,next)=>{
   User.findOne({email:req.body.email , password:req.body.password})
    .exec()
    .then(async(result)=>{
        if(!result){
           return res.status(401).json({
                error : "Auth Failed"
            })
        }
      const token = await result.authtoken()
      let Msg = "Successfully Logged in" 
      if(result.tokens.length >= 4){
          result.tokens = [];
          Msg = "Logged out of all devices. Fresh login"
      }
      result.tokens = result.tokens.concat({token})
      const n_user = await result.save() 
      res.status(201).json({
          Msg,
          token 
      })
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({
            error : "Serer side error"
        })
    })
})

module.exports = router;