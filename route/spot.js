const express = require('express');
const router = express.Router();
const {Spots} = require('../model/spot');
const {auth} = require('../middlewares/auth');
const {admin} = require('../middlewares/admin');
const {Users} = require('../model/user')


router.post("/:id", auth,admin,async(req,res)=>{
    const user = await Users.findById({
        _id:req.params.id,
        isAdmin:true})
    if(!user) res.status(400).send('User not found or not an admin');

    let spot = await Spots.findOne({name:req.body.name});
    if(spot) return res.status(400).send('name already exist pick another')


       spot= new Spots({
       location:req.body.location,
       owner:req.params.id,
       name:req.body.name,
       source:req.body.source 
    })

 try {
    const spots = await spot.save();
    res.status(200).json({
        message:"spot created successfully"
    })
 } catch (error) {
    res.status(400).send(error.message)
 }
})

