//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser")
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(()=>{
    console.log("Connected to the database");
});

const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("Home");
});

app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{
        // We didnt create a app.get() for secrets.ejs because we dont want to
        // render without registering or logging in
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then((found)=>{
        if(found){
            if(found.password === password){
                res.render("secrets");
            }

        }else{
            res.render("Acoount not found, please register yourself");
        }
    }).catch((err)=>{
        console.log(err);
    });

});


app.listen(3000, function(){
    console.log("Server is started on port 3000");
});