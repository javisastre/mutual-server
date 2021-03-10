const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const User = require("../models/user.model");

const { isLoggedIn } = require("../helpers/middleware");

router.get("/user/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const foundUser = await User.findById(userId);
    res.status(201).json(foundUser);
  } catch (error) {
    next(createError(error));
  }
});

router.get("/all", isLoggedIn, async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(201).json(allUsers);
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
