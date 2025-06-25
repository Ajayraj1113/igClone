const express = require("express");
const Post = require("../models/post");
const requireLogin = require("../middleware/requireLogin");
const router = express.Router();

router.post("/createPost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;

  if (!title || !body || !pic) {
    return res.status(422).json({
      error: "Please fill all the fields",
    });
  }

  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });

  post.save().then((data) => {
    // console.log(data)
    return res.status(201).json({
      msg: "Post added Successfully!!",
    });
  });
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find().then((posts) => {
    // console.log(posts)
    return res.status(200).json({ posts });
  });
});

router.get("/mypost", requireLogin, (req, res) => {
  //   console.log(req.user._id);
  Post.find({ postedBy: req.user._id }).then((posts) => {
    // console.log(data)
    return res.status(200).json({
      posts,
    });
  });
});

router.put("/like", requireLogin, (req, res) => {
  const { postId } = req.body;
  // console.log(req.user._id)
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((data) => {
      // console.log("hii")
      // console.log(data)
      res.json({ data });
    })
    .catch((err) => console.log(err.message));
});

router.put("/unlike", requireLogin, (req, res) => {
  const { postId } = req.body;
  // console.log(req.user._id)
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    //   .populate("postedBy", "_id")
    .then((data) => {
      console.log("hii");
      console.log(data);
      res.json({ data });
    })
    .catch((err) => console.log(err.message));
});

router.put("/comment", requireLogin, (req, res) => {
  const postComment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comment: postComment },
    },
    {
      new: true,
    }
  ).then((comment) => {
    // console.log(comment);
    return  res.json({comment})

  });
});

router.delete("/deletepost/:postId",requireLogin,  (req, res)=>{

  // console.log(req.user)
    Post.findOne({_id: req.params.postId})
    // .populate("postedBy", "_id")
      .then((post)=>{
        console.log(post)
        if(post.postedBy._id.toString() === req.user._id.toString()){
          post.deleteOne()
            .then(()=> {
              return res.status(200).json({post})
            })
            .catch(err=> console.log(err))
        }
      })
})

module.exports = router;
