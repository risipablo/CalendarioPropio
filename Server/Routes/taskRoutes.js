const express = require('express')
const { getTask, addTask, deleteTask, completedTask } = require('../Controllers/taskController')
const router = express.Router()

router.get('/task',getTask)
router.post('/add-task',addTask)
router.delete('/task/:id', deleteTask)
router.patch('/task/:id/completed', completedTask)


module.exports = router