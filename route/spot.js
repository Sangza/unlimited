const express = require('express');
const router = express.Router();
const { Spots } = require('../model/spot');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');
const { Users } = require('../model/user')


router.post("/:id", auth, admin, async (req, res) => {
   const user = await Users.findOne({ _id: req.params.id, isAdmin: true });

   if (!user) res.status(400).send('User not found or not an admin');

   let spot = await Spots.findOne({ name: req.body.name });
   if (spot) return res.status(400).send('Name already exists, pick another');


   spot = new Spots({
      location: req.body.location,
      owner: req.params.id,
      name: req.body.name,
      source: req.body.source
   })

   try {
      const spots = await spot.save();
      res.status(200).json({
         message: "spot created successfully"
      })
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// get the number of spot of a particular user
router.get("/getspots/:id", auth, admin, async (req, res) => {
   try {
      const user = await Users.findById({ _id: req.params.id, isAdmin: true });
      if (!user) return res.status(400).send('User is not an Admin or not found');

      const spot = await Spots.find({ owner: req.params.id });
      if (!spot.length) return res.status(400).send('No spot found');
   } catch (error) {
      res.status(500).send('Internal Server Error:', error.message)
   }
})

//get all available spots in a particular location or by name
router.get("/search", auth, async (req, res) => {
   try {
      const { location, name } = req.query;
      let query = {}

      if (location) {
         query.location = new RegExp(location, "i")
      }
      if (name) {
         query.name = new RegExp(name, "i")
      }
      const spot = await Spots.find(query);
      res.json(spot)
   } catch (error) {
      res.status(500).send('Internal Server Error:', error.message)
   }

});

//find a particular spot by id
router.get("/:id", async (req, res) => {
   try {
      const spot = await Spots.findById(req.params.id);
      if (!spot) return res.status(404).send("Spot not found");

      res.status(200).json(spot);
   } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
   }
});

//update a particular spot
router.put("/:id", auth, admin, async (req, res) => {
   try {
      const spot = await Spots.findById(req.params.id);
      if (!spot) return res.status(404).send("Spot not found");

      const spots = await Spots.updateOne({ _id: req.params.id },
         {
            $set: {
               location: req.body.location,
               source: req.body.source,
               owner: req.body.owner,
               name: req.body.name
            }
         },
         {
            new: true
         }
      )
      res.status(200).json({ message: "Spot updated successfully", spots });
   } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
   }
});

// delete a spot by the admin
router.delete("/:id", auth, admin, async (req, res) => {
   try {
      const spot = await Spots.findByIdAndDelete(req.params.id);
      if (!spot) return res.status(404).send("Spot not found");

      res.status(200).json({ message: "Spot deleted successfully" });
   } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
   }

   //search by geolocation or nearby spot
   router.get("/nearby", async (req, res) => {
      try {
         const { lat, lng } = req.query;
         if (!lat || !lng) return res.status(400).send("Latitude and Longitude required");

         const spots = await Spots.find({
            location: {
               $near: {
                  $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                  $maxDistance: 5000, // 5km radius
               },
            },
         });

         res.json(spots);
      } catch (error) {
         res.status(500).send("Internal Server Error: " + error.message);
      }
   });

}
)

module.exports = router;

