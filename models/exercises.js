const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema=new Schema({
    description:{type:String,required:true},
    duration:{type:Number,required:true},
    date:String
});

let Exercise = mongoose.model('Exercise',exerciseSchema);


exports.exerciseSchema = exerciseSchema;
exports.Exercise = Exercise;