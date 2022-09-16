const mongoose = require("mongoose")

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;




var careerSchema = mongoose.Schema({
    name : String,
    description: String , 
    reason_target_date : Date,
   completed_date : Date
    
})

var userSchema = mongoose.Schema({
    username : String,
    password : String,
})



var Career = mongoose.model("career", careerSchema)
var User = mongoose.model("user", userSchema)

module.exports = {
    Career, User
}