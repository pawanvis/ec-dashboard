const PartnerCounseling = require('../models/PartnerCounseling');

// ✅ Create (POST)
exports.createPartnerCounseling = async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, userMessage, termsAccepted } = req.body;

    if (!fullName || !emailAddress || !phoneNumber) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    const sessionData = new PartnerCounseling({
      fullName,
      emailAddress,
      phoneNumber,
      userMessage,
      termsAccepted
    });

    await sessionData.save();
    res.status(201).json({ message: 'Request saved successfully', data: sessionData });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ List (GET)
exports.getPartnerCounselings = async (req, res) => {
  try {
    const data = await PartnerCounseling.find().sort({ createdAt: -1 });
    res.status(200).json({ count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete (DELETE)
exports.deletePartnerCounseling = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PartnerCounseling.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
