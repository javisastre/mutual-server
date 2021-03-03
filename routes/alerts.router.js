const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const Alert = require("../models/alert.model");

const { isLoggedIn } = require("../helpers/middleware");

// TODO Location set to New York by default during development
router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const locationArray = [40.73, -73.93];

    const createdAlert = await Alert.create({
      person: userId,
      location: locationArray,
    });

    //TODO Missing push notification to members of all nets
    if (createdAlert) res.status(201).json(createdAlert);
  } catch (error) {
    next(createError(error));
  }
});

router.post("/delete", isLoggedIn, async (req, res, next) => {
  try {
    const alertId = req.body.value;

    await Alert.findByIdAndDelete(alertId);
    res.status(201).json({ message: "Alert removed succesfully" });
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
