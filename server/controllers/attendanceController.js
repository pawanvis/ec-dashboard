const Attendance = require('../models/attendanceModel');
const ZKLib = require('node-zklib');

exports.fetchAttendance = async (req, res) => {
  try {
    let zk = new ZKLib('192.168.1.21', 4340, 10000, 4000);

    await zk.createSocket();

    // Get logs from device
    let logs = await zk.getAttendances();
    
    // Save logs to MongoDB
    for (let log of logs.data) {
      await Attendance.create({
        uid: log.uid,
        userId: log.userId,
        timestamp: log.timestamp
      });
    }

    res.json({ message: "Attendance data saved successfully", count: logs.data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};
