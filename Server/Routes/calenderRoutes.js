const express = require("express");
const { getNotesByDate,deleteNote, addNote } = require("../Controllers/calenderControllers");
const router = express.Router();


router.get("/notes/:date", getNotesByDate); 
router.post("/notes", addNote); 
router.delete("/notes", deleteNote); 

module.exports = router;