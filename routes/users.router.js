const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const User = require("../models/user.model");

const { isLoggedIn } = require("../helpers/middleware");

router.get("/alert-sender", isLoggedIn, async (req, res, next) => {
  try {
    const { senderId } = req.body;
    const alertSender = await User.findById(senderId);

    res.status(201).json(alertSender);
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
