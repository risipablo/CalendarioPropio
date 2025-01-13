const express = require('express')
const router = express.Router();

const {getAcciones, addAccion, patchAccion, saveAccion, deleteAccion} = require('../Controllers/accionController');

router.get('/tareas', getAcciones)
router.post('/add-tareas', addAccion)
router.delete('/tareas/:id', deleteAccion);
router.patch('/tareas/:id', patchAccion);
router.patch('/tareas/:id',saveAccion)

module.exports = router

