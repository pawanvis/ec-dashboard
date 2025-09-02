const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    meta_title:{
        type:String,
        require: true
    },
    meta_description:{
        type:String,
        require:true
    },
    meta_keywords:{
        type:String,
        require:true
    },
    event_title:{
        type:String,
        require:true
    },
    event_url:{
        type:String,
        require:true
    },
    author_name:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    event_date:{
        type:String,
        require:true
    },
    event_img:{
        type:String,
    },
    event_description:{
        type:String,
        require:true
    }
})

const event = mongoose.model('event', eventSchema)
module.exports = event