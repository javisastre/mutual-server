const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Net = require("../models/net.model");

// HELPER FUNCTIONS
const { isLoggedIn, validateNetCreation } = require("../helpers/middleware");

router.post('/create', isLoggedIn, validateNetCreation, async (req, res, next) => {
  try {
    const  userId = req.session.currentUser._id
    const { netname, netcode } = req.body
    const newNet = await Net.create( {netname, netcode} )
    const netId = newNet._id
    const netWithUser = await Net.findByIdAndUpdate(netId, { $push: { members: userId} }, { new: true } )
    if (netWithUser) {
      res.status(201).json(netWithUser)
    }
  } catch (error) {
    next( createError(error) );
  }
})

module.exports = router;