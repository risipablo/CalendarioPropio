const express = require('express')
const router = express.Router();

const {getAcciones, addAccion, patchAccion, deleteAccion, saveAccion} = require('../Controllers/accionController');


router.get('/tareas', getAcciones)
router.post('/add-tareas', addAccion)
router.delete('/tareas/:id', deleteAccion);
router.patch('/tareas/:id/completed', patchAccion);
router.patch('/tareas/:id',saveAccion)

module.exports = router

