const express = require("express")
const router = express.Router()
const User = require("../models/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { SECRETKEY } = require("../keys")
const requireLogin = require("../middleware/requireLogin")

router.post("/signup", (req, res)=>{
    const {name , email, password} = req.body

    if(!name || !email || !password ){
        res.status(422).json({msg: "Please add all the fields!!"})
    } else {
        User.findOne({email:email})
            .then(savedUser=>{
                // console.log(savedUser)
                if(savedUser){
                    res.status(422).json({msg: "User already exists!!"})
                }else {
                bcrypt.hash(password, 12)
                    .then(hashedPassword=>{
                        // console.log(hashedPassword)
                        const user = new User ({
                            name,
                            email,
                            password: hashedPassword
                        })

                        user.save()
                        res.status(200).json({msg: "User added succesfully!!"})
                    })
                }
            })
    }
})

router.post("/signin", (req, res) =>{
    const {email, password} = req.body

    if(!email || !password ){
        res.status(422).json({msg: "Please add all the fields!!"})
    }

    User.findOne({email:email})
        .then(dbUser=>{
            // console.log(dbUser)

            if(!dbUser){
                return res.status(422).json({errorMessage: "No user exist for this email!!"})
            }

            bcrypt.compare(password, dbUser.password)
                .then(()=>{
                    const token = jwt.sign({id:dbUser._id}, SECRETKEY)
                    // console.log("token : ", token)

                    return res.status(200).json({msg: "login successfully",token})
                })

        })

})


router.get("/protected", requireLogin, (req, res)=>{
    res.status(200).json({msg: "Access granted!!"})
})



module.exports = router