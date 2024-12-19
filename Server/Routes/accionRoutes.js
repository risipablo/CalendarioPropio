const express = require('express')
const router = express.Router();

const {getAcciones, addAccion,  patchAccion, saveAccion} = require('../Controllers/accionController');
const { deleteCalender } = require('../Controllers/calenderControllers');

router.get('/tareas',getAcciones)
router.post('/add-tareas',addAccion)
router.delete('/api/notes/:noteId', deleteCalender);
router.patch('/acciones/:id', patchAccion);
router.patch('/acciones/:id', saveAccion)

module.exports = router

