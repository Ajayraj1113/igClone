const express = require("express")
const Post = require("../models/post")
const requireLogin = require("../middleware/requireLogin")
const router = express.Router()


router.post("/createPost", requireLogin, (req, res)=>{

    const {title, body, pic}  = req.body

    if(!title || !body || !pic) {
        return res.status(422).json({
            error: "Please fill all the fields"
        })}

        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user
        })

        post.save()
            .then(data =>{
                // console.log(data)
                return res.status(201).json({
                    msg : "Post added Successfully!!"
                })
            })
    
})


router.get("/allpost", requireLogin,  (req, res)=>{

    Post.find()
        .then(posts =>{
            // console.log(posts)
            return res.status(200).json({posts})
        })
})

module.exports = router