const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    meta_title:{
       type: String,
       require: true
    },
    meta_description:{
        type: String,
        require:true
    },
    meta_keywords:{
        type: String,
        require: true
    },
    title:{
        type: String,
        require: true
    },
    blog_url:{
        type: String,
        require :true
    },
    author_name:{
        type:String,
        require: true
    },
    category:{
        type:String,
        require: true
    },
    blog_date:{
        type:String,
        require: true
    },
    blog_description:{
        type:String,
        require:true
    },
    blog_img:{
        type:String,
    }
})

const blog = mongoose.model('blog' , blogSchema)
module.exports = blog
