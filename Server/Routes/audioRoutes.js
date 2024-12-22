const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadAudio, getAudios, deleteAudio } = require('../Controllers/audioController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('audio'), uploadAudio);
router.get('/audios', getAudios);
router.delete('/audios/:id', deleteAudio);

module.exports = router;