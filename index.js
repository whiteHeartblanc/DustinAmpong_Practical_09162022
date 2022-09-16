const express = require("express")
const bodyparser = require("body-parser")
const hbs = require("hbs")

const cookieparser= require("cookie-parser")
const mongoose = require("mongoose")
/*
const connectionString = "mongodb+srv://admin:admin@cluster0-vec8s.gcp.mongodb.net/meyerfood?retryWrites=true&w=majority"
*/

const connectionString ="mongodb+srv://dustin_ampong:JZXE8vdiNKb1EI63@cluster0.lhsur0q.mongodb.net/practical?retryWrites=true&w=majority"
  


mongoose.Promise = global.Promise
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; 


const app = express()
const urlencoder = bodyparser.urlencoded({
    extended : false
})
ObjectId = require('mongodb').ObjectID;
const querystring = require('querystring');


app.use(cookieparser())
app.use(express.static(__dirname + "/public"))

const Career = require("./models/database.js").Career
const User = require("./models/database.js").User

app.get("/", (req, res)=>{
    
     if(req.cookies.loggeduser){
     
        
        console.log(req.cookies.UserId)
         console.log(req.cookies.AccountType)
    
        res.redirect("/home")
        }
        
        
    
    else{
        res.sendFile(__dirname+"/public/login.html")
    }
   
})

app.get("/home", (req,res)=>{
  
     res.sendFile(__dirname+"/views/home.html")
    
})


app.get("/renderHome",function(req, res){
      res.redirect("/home")
})




app.post("/login", urlencoder, function(req, res){
  
   let username= req.body.un   
   let password= req.body.pw
   
   User.findOne({
       username : username,
      
   }, (err, doc)=>{
       
       if(err){
           res.send("Something went wrong")
       }else if(!doc){
         // alert("Username does not exist");
           //res.send("Username does not exist");
            res.sendFile(__dirname+"/public/usernotexist.html")
    
       }
       else{
           let passwordDb= doc.password
           //console.log(doc.password)
         //  console.log(password)
        
           if(password != passwordDb){
            //   alert("Password is incorrect");
             //  res.send("Password is incorrect");
                res.sendFile(__dirname+"/public/passwordwrong.html")
           }
           else{
           
          let fs= username
             
    res.cookie("loggeduser", fs,{
        maxAge : 1000*60*60*24*31
     
        
        
    })
           
               
          
           
   
    

           res.redirect("/")
       }
       }
       
   })
   
   
  
  
})

app.post("/logout", urlencoder, function(req, res){
   
  res.clearCookie("loggeduser");
      res.clearCookie("UserId");

  
    res.redirect("/")
})





app.post("/register", urlencoder, function(req,res){
    let username = req.body.un
    let password = req.body.pw
    let accounttype= req.body.at
    let email = req.body.email
        
         
    let user = new User({
        username : username,
        password : password,
        accounttype: accounttype,
        email : email
    })
    
    user.save().then((doc)=>{
        console.log(doc)
       
    
        
        res.redirect("/")
                    
    }, (err)=>{
            
        res.send("Something went wrong")
              
    })
         
})
app.post("/addCareer", urlencoder, function(req,res){
    
    let name= req.body.name
    let description= req.body.description 
    let reason_target_date =req.body.targetDate
    let completed_date=req.body.completedDate
      let career= new Career({
        
    name,
    description,
     description,
     reason_target_date,
     completed_date
          
         
         
         })
         career.save().then((doc)=>{
             
             console.log(doc)
                res.redirect("/rendercareer")
         
        
         }, (err)=>{
            
             res.send(err)
             
             
             
         })
  
})

app.post("/deletecareer", urlencoder, (req,res)=>{
    
     console.log("POST /delete")
    Career.deleteOne({
        _id: req.body.id
        
    }, (err,doc)=>{
        if(err){
            res.send(err)
        }else{
          // no need if ajax  res.redirect("/users")
           /// to see what doc say
            // n number of deleted, ok: means success   Deletecount: how many deleted
            console.log(doc)
            // send the doc
            
            res.send(doc)
            
        }
        
    })
    
    
})
    
    
    



app.get("/rendercareer",function(req,res){
    
     
    Career.find({
        
    }, (err,docs)=>{
        console.log(docs)
        if (err){
            res.send(err)
        }else{
            res.render("career.hbs", {
                career:docs
            })
        }
    })
    
    
    
})
    
 




app.set('port', (process.env.PORT || 3000))






app.listen(app.get('port'), ()=>{
    console.log("Server is now live at port 3000.")
})