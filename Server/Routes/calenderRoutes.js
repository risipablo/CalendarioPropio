const express = require('express');
const { getCalender, deleteCalender, addCalender } = require('../Controllers/calenderControllers');
const router = express.Router();


router.get('/notes',getCalender)
router.post('/add-notes',addCalender)
router.delete('/notes/:id', deleteCalender);


module.exports = router;