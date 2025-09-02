const BrochureRequest = require('../models/BrochureRequest');
const nodemailer = require('nodemailer');
const path = require('path');

// Submit brochure request
exports.submitBrochureRequest = async (req, res) => {
  const { fullName, email, phone, courseInterest, agreeToUpdates } = req.body;

  try {
    // Save to MongoDB
    const request = new BrochureRequest({
      fullName,
      email,
      phone,
      courseInterest,
      agreeToUpdates
    });

    await request.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pawan@e3mediacrafters.com',
        pass: 'kekn zmma nfia snpa' // Use environment variables in production
      }
    });

    const mailOptions = {
      from: 'pawan@e3mediacrafters.com',
      to: email,
      subject: 'Your Requested Course Brochure',
      text: `Dear ${fullName},\n\nThanks for your interest in ${courseInterest}. Please find the brochure attached.\n\nBest Regards,\nTeam`,
      attachments: [
        {
          filename: 'brochure.pdf',
          path: path.join(__dirname, '../brochure.pdf')
        }
      ]
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Form submitted but email failed to send',
          data: request
        });
      }
      res.status(200).json({ 
        success: true,
        message: 'Form submitted & brochure sent!',
        data: request
      });
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get all brochure requests
exports.getAllBrochureRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { courseInterest: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await BrochureRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await BrochureRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: requests,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get single brochure request
exports.getBrochureRequest = async (req, res) => {
  try {
    const request = await BrochureRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: request 
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};


exports.deleteBrochureRequest = async (req, res) => {
  try {
    const request = await BrochureRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Brochure request deleted successfully',
      data: request
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};