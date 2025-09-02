const express = require('express');
const router = express.Router();
const {
  createPartnerCounseling,
  getPartnerCounselings,
  deletePartnerCounseling
} = require('../controllers/partnerCounselingController');

router.post('/partner-counseling', createPartnerCounseling);   // POST
router.get('/partner-counseling', getPartnerCounselings);      // LIST
router.delete('/partner-counseling/:id', deletePartnerCounseling); // DELETE

module.exports = router;
