const express = require('express')
const router = express.Router();

const {getAcciones, addAccion, patchAccion, deleteAccion, saveAccion, deleteAll} = require('../Controllers/accionController');


router.get('/tareas', getAcciones)
router.post('/add-tareas', addAccion)
router.delete('/tareas/:id', deleteAccion);
router.patch('/tareas/:id/completed', patchAccion);
router.patch('/tareas/:id',saveAccion)
router.delete('/tareas', deleteAll);

module.exports = router

