const express = require("express");
const multer = require("multer");
const path = require("path");
const AcademicPartner = require("../models/AcademicPartner");

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CREATE
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths = req.files?.map(file => file.path) || [];
    const newPartner = new AcademicPartner({ 
      ...req.body, 
      images: imagePaths 
    });
    await newPartner.save();
    res.status(201).json({ message: "Partner Created Successfully", partner: newPartner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL OR FILTER BY AP CODE
router.get("/", async (req, res) => {
  try {
    const { apCode } = req.query;
    
    // If AP Code provided, filter by it
    if (apCode) {
      const partner = await AcademicPartner.findOne({ apCode });
      if (!partner) {
        return res.status(404).json({ message: "Partner not found with this AP Code" });
      }
      return res.json(partner);
    }
    
    // Otherwise return all partners
    const partners = await AcademicPartner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const partner = await AcademicPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    let updatedData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    }
    
    const updatedPartner = await AcademicPartner.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    
    res.json({ 
      message: "Partner Updated Successfully", 
      partner: updatedPartner 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletedPartner = await AcademicPartner.findByIdAndDelete(req.params.id);
    if (!deletedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json({ message: "Partner Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;