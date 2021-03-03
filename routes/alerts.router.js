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
    res.status(201).json({ "message": "Alert removed succesfully" });
  } catch (error) {
    next(createError(error));
  }
});

router.post("/iamfine", isLoggedIn, async (req, res, next) => {
  try {
    const alertId = req.body.value;
    const updatedAlert = await Alert.findByIdAndUpdate(
      alertId,
      {
        active: false,
      },
      { new: true }
    );
    if (updatedAlert) res.status(201).json(updatedAlert);
  } catch (error) {
    next(createError(error));
  }
});

router.post("/archive", isLoggedIn, async (req, res, next) => {
  try {
    const { alertId, category, story } = req.body;
    let public = req.body.public;

    public === "no" ? (public = false) : (public = true);

    if (!public) {
      await Alert.findByIdAndDelete(alertId);
      res.status(201).json({ "message": "Alert removed succesfully" });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      alertId,
      {
        public,
        category,
        story,
      },
      { new: true }
    );

    res.status(201).json(updatedAlert);
  } catch (error) {}
});

router.get("/active/:alertId", isLoggedIn, async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const foundAlert = await Alert.findById(alertId);

    if (foundAlert.active) {
      res.status(201).json(foundAlert);
    } else {
      res.status(400).json({ "message": "This alert is not active" });
    }
  } catch (error) {
    next(createError(error));
  }
});

router.get("/heatmap", isLoggedIn, async (req, res, next) => {
  try {
    const allAlerts = await Alert.find({ active: false });
    res.status(201).json(allAlerts);
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
