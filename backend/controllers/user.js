const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const Post = require("../models/post");
const requireLogin = require("../middleware/requireLogin");
const { trusted } = require("mongoose");

router.get("/profile/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((data) => {
    console.log("user data: ", data);
    Post.find({ postedBy: req.params.id })
      .then((data) => res.json(data))
      .catch((err) => console.log(err));
  });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true }
  )
    .then((data) => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      ).then(() => res.json(data));
    })
    .catch((err) => console.log(err));
});

module.exports = router;
