const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const Alert = require("../models/alert.model");
const User = require("../models/user.model");

const { isLoggedIn } = require("../helpers/middleware");

// TODO Location set to New York by default during development
router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const locationArray = [40.73, -73.93];

    //CHECK IF YOU ALREADY HAVE AN ALERT SENT
    const mySelf = await User.findById(userId);
    if (mySelf.userAlert) return next(createError(400));

    //IF YOU DON'T HAVE AN ALERT, CREATE ONE
    const createdAlert = await Alert.create({
      person: userId,
      location: locationArray,
    });

    const alertId = createdAlert._id;
    await User.findByIdAndUpdate(userId, { userAlert: alertId });

    const populatedUser = await User.findById(userId).populate({
      path: "nets",
      populate: "members",
    });

    // we create the list of unique users we have to push the new alert to
    const uniqueUserList = [];
    populatedUser.nets.map((net) => {
      net.members.map((member) => {
        if (!uniqueUserList.includes(member._id)) {
          uniqueUserList.push(member._id);
        }
      });
    });

    uniqueUserList.map(async (eachUserId) => {
      await User.findByIdAndUpdate(eachUserId, {
        $push: { netAlerts: alertId },
        //TODO THIS IS THE MOMENT WHERE SOCKET NOTIFICATIONS HAVE TO BE SENT
      });
    });

    // finishing code of the route
    if (createdAlert) res.status(201).json(createdAlert);
  } catch (error) {
    next(createError(error));
  }
});

router.post("/delete", isLoggedIn, async (req, res, next) => {
  try {
    const alertId = req.body.value;
    const userId = req.session.currentUser._id;

    //REMOVE THE ALERT FROM THE USER ARRAY
    await User.findByIdAndUpdate(userId, { userAlert: undefined });

    //REMOVE THE ALERT FROM THE FRIENDS NETS
    const populatedUser = await User.findById(userId).populate({
      path: "nets",
      populate: "members",
    });

    //EXTRACT ALL USERIDS FROM THE POPULATED USER
    populatedUser.nets.map((eachNet) => {
      eachNet.members.map(async (eachMember) => {
        if (String(eachMember._id) !== String(userId)) {
          const updatedNetAlerts = eachMember.netAlerts.filter(
            (eachAlert) => String(eachAlert) !== String(alertId)
          );
          await User.findByIdAndUpdate(eachMember._id, {
            netAlerts: updatedNetAlerts,
          });
        }
      });
    });

    //DELETE THE ALERT
    const alertDeleted = await Alert.findByIdAndDelete(alertId);

    if (alertDeleted) {
      res.status(201).json({ "message": "Alert removed succesfully" });
    } else {
      next(createError(error));
    }
  } catch (error) {
    next(createError(error));
  }
});

router.post("/iamfine", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const alertId = req.body.value;

    const updatedAlert = await Alert.findByIdAndUpdate(
      alertId,
      {
        active: false,
      },
      { new: true }
    );

    //REMOVE ALERT FROM FRIENDS
    const populatedUser = await User.findById(userId).populate({
      path: "nets",
      populate: "members",
    });

    //EXTRACT ALL USERIDS FROM THE POPULATED USER
    populatedUser.nets.map((eachNet) => {
      eachNet.members.map(async (eachMember) => {
        if (String(eachMember._id) !== String(userId)) {
          const updatedNetAlerts = eachMember.netAlerts.filter(
            (eachAlert) => String(eachAlert) !== String(alertId)
          );
          await User.findByIdAndUpdate(eachMember._id, {
            netAlerts: updatedNetAlerts,
          });
        }
      });
    });

    if (updatedAlert) res.status(201).json(updatedAlert);
  } catch (error) {
    next(createError(error));
  }
});

router.post("/archive", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    await User.findByIdAndUpdate(userId, { userAlert: undefined });

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
