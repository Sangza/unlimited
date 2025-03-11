const express = require('express');
const router = express.Router();
const { Prices } = require('../model/price');
const admin = require('../middlewares/admin');
const { Spots } = require('../model/spot');
const auth = require('../middlewares/auth');
const { set } = require('mongoose');

//post a price for a particular spot.
router.post("/", admin, async (req, res) => {
    try {
        const spot = await Spots.findById({ _id: req.body.spotId })
        if (!spot) return res.status(400).send("spot doesn't exist");

        let price = new Prices({
            duration: req.body.duration,
            amount: req.body.amount,
            spot: req.body.spotId
        })

        await price.save()
        res.status(200).send(price);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }

})

//get the prices for a particular spot
router.get('/:id', auth, admin, async (req, res) => {
    const spot = await Spots.findById({ _id: req.params.id })
    if (!spot) return res.status(400).send("spot doesn't exist");

    try {
        const prices = await Prices.find({ spot: req.params.id })
        if (!prices.length) return res.status(400).send("no price yet")

        res.status(200).json({
            prices
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

//update price details for a particular user
router.put('/getupdate/:id', admin, async (req, res) => {
    const price = await Prices.findOne({
        _id: req.params.id,
        spot: req.body.spotId
    })
    if (!price) return res.status(400).send("price doesn't exist")

    try {
        const price = await Prices.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    duration: req.body.duration,
                    amount: req.body.amount
                }
            },
            {
                new: true
            }
        )
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

//delete a particular price
router.delete('/:id', admin, async (req, res) => {
    const price = await Prices.findOne({
        spot: req.body.spotId,
        _id: req.params.id
    })
    if (!price) res.status(400).json({
        "successfully deleted": price
    })
})

module.exports = router;
