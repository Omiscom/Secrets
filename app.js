//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB") ;
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})


const User = new mongoose.model("User", userSchema)


app.get("/", (req,res)=>{
    res.render("home");
});

app.route("/login")
.get((req,res)=>{
    res.render("login");
})
.post((req, res)=>{
    const username = req.body.email;
    const password = req.body.password;

    User.findOne({email:username}).then((foundUser)=>{  

            if(foundUser.password === password){
                res.render("secrets");
            }else{
                res.send("Password is incorrect! Try again later")
            }
        
    }).catch((err)=>{
        res.send("Can't login, username cannot be found");
    })
});


app.route("/register")

.get((req,res)=>{
    res.render("register");
})

.post((req,res)=>{
    const newUser = new User({
        email : req.body.email,
        password : req.body.password
    });
    newUser.save().then((result)=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log("Failed to login");
    })
});



app.listen(3000, function(){
    console.log("App is running on port 3000");
})
