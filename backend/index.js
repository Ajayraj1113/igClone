const express = require("express")
const { default: mongoose } = require("mongoose")
const { MONGOURI } = require("./keys")
const app = express()

function middlewares(req, res, next){
    console.log("hi from middleware")
    next()
}

// app.use(middlewares)

app.use(express.json())   
app.use(express.urlencoded({extended: true}))

app.get("/api/health",middlewares, (req, res)=>{
    res.send({msg: "Everthing is Ok!!"})
})

mongoose.connect(MONGOURI)
    .then(()=> console.log("Database connected successfully!!"))
    .catch(err=> console.log("Something went wrong!!", err.message))

app.use(require("./controllers/auth"))
app.use(require("./controllers/post"))



const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(`Server is running on port http://localhost:${PORT}`)
})
