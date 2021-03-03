const express = require("express");
const router = express.Router();

const createError = require("http-errors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Net = require("../models/net.model");

// HELPER FUNCTIONS
const { isLoggedIn, validateNetData } = require("../helpers/middleware");

router.post("/create", isLoggedIn, validateNetData, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { netname, netcode } = req.body;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashNetCode = await bcrypt.hash(netcode, salt);

    const newNet = await Net.create({ netname, netcode: hashNetCode });
    const netId = newNet._id;
    const netWithUser = await Net.findByIdAndUpdate(
      netId,
      { $push: { members: userId } },
      { new: true }
    );
    if (netWithUser) {
      res.status(201).json(netWithUser);
    }
  } catch (error) {
    next(createError(error));
  }
});

router.put("/join", isLoggedIn, validateNetData, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const { netname, netcode } = req.body;
    const foundNet = await Net.findOne({ netname });

    const passwordCorrect = await bcrypt.compare(netcode, foundNet.netcode);

    if (!passwordCorrect) {
      return res.status(400).json({ message: "Please, try again" });
    }

    const foundMember = foundNet.members.find(
      (member) => String(member) === String(userId)
    );

    if (!foundNet) {
      res.status(400).json({ message: "net does not exist" });
    } else if (foundMember) {
      res.status(401).json({ message: "already a member" });
    } else {
      const netId = foundNet._id;
      const updatedNet = await Net.findByIdAndUpdate(
        netId,
        { $push: { members: userId } },
        { new: true }
      );

      if (updatedNet) res.status(201).json(updatedNet);
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

    const { members } = foundNet;

    const updatedMembers = members.filter(
      (memberId) => String(memberId) !== String(userId)
    );

    if (updatedMembers.length === 0) {
      await Net.findByIdAndDelete(netId);
      res.status(201).json({ message: "no members left, net deleted" });
    } else {
      const updatedNet = await Net.findByIdAndUpdate(
        netId,
        { members: updatedMembers },
        { new: true }
      );
      if (updatedNet) res.status(201).json(updatedNet);
    }
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
