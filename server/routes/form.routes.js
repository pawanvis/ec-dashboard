const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createForm,
  getForms,
  getForm,
  updateForm,
  deleteForm,
} = require('../controllers/form.controller');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
    cb(null, unique);
  },
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

router.post(
  '/',
  upload.fields([
    { name: 'education_docs', maxCount: 20 },
    { name: 'employment_docs', maxCount: 20 },
    { name: 'identification_docs', maxCount: 20 },
    { name: 'awards_docs', maxCount: 20 },
    { name: 'purpose_docs', maxCount: 20 },
    { name: 'resume_docs', maxCount: 5 },
  ]),
  createForm
);

router.get('/', getForms);
router.get('/:id', getForm);
router.patch('/:id', updateForm);
router.delete('/:id', deleteForm);

module.exports = router;
