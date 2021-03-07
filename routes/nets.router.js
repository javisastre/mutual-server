const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const Net = require("../models/net.model");
const User = require("../models/user.model");

// HELPER FUNCTIONS
const { isLoggedIn, validateNetData } = require("../helpers/middleware");

router.post("/create", isLoggedIn, validateNetData, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { netname, netcode } = req.body;

    const newNet = await Net.create({ netname, netcode });
    const netId = newNet._id;
    const netWithUser = await Net.findByIdAndUpdate(
      netId,
      { $push: { members: userId } },
      { new: true }
    );
    const UserwithNet = await User.findByIdAndUpdate(
      userId,
      {
        $push: { nets: netId },
      },
      { new: true }
    );
    req.session.currentUser = UserwithNet;
    if (netWithUser) {
      res.status(201).json({ netWithUser, UserwithNet });
    }
  } catch (error) {
    next(createError(error));
  }
});

router.put("/join", isLoggedIn, validateNetData, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { netname, netcode } = req.body;
    const foundNet = await Net.findOne({ netname, netcode });

    const foundMember = foundNet.members.find(
      (member) => String(member) === String(userId)
    );

    if (!foundNet) {
      res.status(400).json({ "message": "net does not exist" });
    } else if (foundMember) {
      res.status(401).json({ "message": "already a member" });
    } else {
      const netId = foundNet._id;
      const updatedNet = await Net.findByIdAndUpdate(
        netId,
        { $push: { members: userId } },
        { new: true }
      );
      const updatedSelf = await User.findByIdAndUpdate(
        userId,
        { $push: { nets: netId } },
        { new: true }
      );

      if (updatedNet) res.status(201).json({ updatedNet, updatedSelf });
    }
  } catch (error) {
    next(createError(error));
  }
});

router.post("/leave", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;

    const netId = req.body.value;
    const foundNet = await Net.findById(netId);

    // we look for the user and extract its nets array
    const foundUser = await User.findById(userId);
    const { nets } = foundUser;
    // we remove the net from the user nets
    const updatedNets = nets.filter(
      (singleNetId) => String(singleNetId) !== String(netId)
    );

    const updatedSelf = await User.findByIdAndUpdate(
      userId,
      { nets: updatedNets },
      { new: true }
    );

    // we look for the net and extract its members array
    const { members } = foundNet;
    // we remove the user from the net members array
    const updatedMembers = members.filter(
      (memberId) => String(memberId) !== String(userId)
    );

    if (updatedMembers.length === 0) {
      await Net.findByIdAndDelete(netId);
      res.status(201).json({ "message": "no members left, net deleted" });
    } else {
      const updatedNet = await Net.findByIdAndUpdate(
        netId,
        { members: updatedMembers },
        { new: true }
      );
      if (updatedNet) res.status(201).json({ updatedNet, updatedSelf });
    }
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
