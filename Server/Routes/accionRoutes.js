const express = require('express')
const router = express.Router();

const {getAcciones, addAccion, deleteAccion, patchAccion, saveAccion} = require('../Controllers/accionController')

router.get('/tareas',getAcciones)
router.post('/add-tareas',addAccion)
router.delete('/acciones/:id', deleteAccion); 
router.patch('/acciones/:id', patchAccion);
router.patch('/acciones/:id', saveAccion)

module.exports = router

