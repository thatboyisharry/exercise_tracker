const mongoose = require('mongoose');
const {exerciseSchema} = require('./exercises');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    log:[exerciseSchema]
});



let User = mongoose.model('User',userSchema);
module.exports=User;