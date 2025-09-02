const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const connectDB = require('./config/db');

const studentRoutes = require('./routes/students');
const academicPartnerRoutes = require('./routes/academicPartnerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const counsellingRoutes = require('./routes/counselling');
const brochureRoutes = require('./routes/brochureRoutes');
const partnerCounselingRoutes = require('./routes/partnerCounselingRoutes');
const BlogRoutes = require('./routes/blog.routes')
const EventRoutes = require('./routes/event.routes')
const helloRoutes = require('./routes/helloRoutes');
const formRoutes = require('./routes/form.routes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://api.ec-businessschool.in', 'http://localhost:5173', 'http://localhost:3000', 'https://ec-businessschool.eu'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use('/api/partners', academicPartnerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/counselling', counsellingRoutes);
app.use('/api/brochure', brochureRoutes);
app.use('/api/', partnerCounselingRoutes);
app.use('/api/blogs', BlogRoutes);
app.use('/api/events', EventRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use('/api/hello', helloRoutes);
app.use('/api/forms', formRoutes);
app.use('/attendance', attendanceRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
