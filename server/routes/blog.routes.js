const express = require('express');
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Blog = require('../models/blog.model');


const storage = multer.diskStorage({
    destination:(req, file, cb) => {
       cb(null, './uploads')
    },
    filename:(req, file, cb) => {
       const newFileName = Date.now() + path.extname(file.originalname)
       cb(null, newFileName)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
       cb(null, true) 
    }else{
        cb(new Error('Only Images are Allowed!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limit: {
        fileSize : 1024 * 1024 * 3
    }
})

// Get All Blog
router.get('/', async (req, res) => {
   try{
        const blog = await Blog.find()
        res.json(blog)
   }catch(err){
      res.status(500).json({message: err.message})
   }
})

// Get Single Blog
router.get('/:id', async (req, res) => {
   try{
      const blog = await Blog.findById(req.params.id)
      if(!blog) return res.status(404).json({message: 'Blog not found'})
      res.json(blog)
   }catch(err){
      res.status(500).json({message: err.message})
   }
})

// Add New Blog
router.post('/', upload.single('blog_img'), async (req, res) => {
   try{
      const blog = new Blog(req.body)
      if(req.file){
         blog.blog_img = req.file.filename
      }
      const newBlog = await blog.save()
      res.status(201).json(newBlog)
   }catch(err){
      res.status(400).json({message: err.message})
   }
})

// Update a Blog
router.put('/:id', upload.single('blog_img'), async (req, res) => {
    try {
        const existingBlog = await Blog.findById(req.params.id);
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog Not Found' });
        }

        if (req.file) {
            if (existingBlog.blog_img) {
                const oldImagePath = path.join(__dirname, '../uploads', existingBlog.blog_img);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log('Failed to delete old image:', err);
                });
            }
            req.body.blog_img = req.file.filename;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a BLog
router.delete('/:id', async (req, res) => {
   try{
    const blog =  await Blog.findByIdAndDelete(req.params.id)
    if(!blog) return res.status(404).json({message: 'Blog not Found'})

        if (blog.blog_img){
            const filePath = path.join('./uploads', blog.blog_img)
            fs.unlink(filePath, (err) => {
                if(err) console.log('Failed to Delete:' , err)
            })
        }
        
        res.json({message: 'Blog Deleted'})
   }catch(err){
      res.status(500).json({message: err.message})
   }
})

module.exports = router