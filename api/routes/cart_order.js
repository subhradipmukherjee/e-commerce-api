const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
const User = require("../models/user");
const Product = require("../models/product");
const check = require('../middleware/auth')


const place = (req,res,next) =>{
  req.name = "607dc4e061927f13d44e18e0";
  next() 
}
router.post("/",check,async(req,res,next)=>{
//   const id = req.userid;
//   const user = await User.findById(id);
//   if(!user)
//   {
//       return res.status(404).json({
//           error: " User not found "
//       })
//   }
   const products = req.body
   const user = req.user
   let i=0;
  products.forEach(element => {
    user.cart[i] = ObjectId(element.product);
    i++;
  });
  const n_cart = user.cart;
  const id = ObjectId(req.name)
  const u_user = await User.update({ _id: req.userid }, { $set: {
      cart : n_cart
  } })

 console.log(u_user)
 res.status(200).json(user)

})

router.get("/",check,async(req,res,next)=>{
 User.findOne({_id:req.userid})
    .populate("cart")
    .select("cart")
    .exec()
    .then((prod)=>{
       res.status(201).json(prod)
   }).catch((err)=>{
       console.log(err)
       res.status(500).json({
           error: err
       })
   })
})

module.exports = router;