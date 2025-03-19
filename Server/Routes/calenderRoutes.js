const express = require("express");
const { getNotesByDate,deleteNote, addNote, editNote } = require("../Controllers/calenderControllers");
const router = express.Router();


router.get("/notes/:date", getNotesByDate); 
router.post("/notes", addNote); 
router.delete("/notes", deleteNote); 
router.patch("/notes", editNote);

module.exports = router;