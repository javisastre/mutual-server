const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const User = require("../models/user.model");

const { isLoggedIn } = require("../helpers/middleware");

router.get("/nets", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const superUser = await User.findById(userId).populate("nets");

    

    res.status(201).json(superUser);
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
