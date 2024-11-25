const express = require('express')
const { getTask, addTask, completedTask, saveTask, deleteTask, deleteMultipleTasks} = require('../Controllers/taskController')
const router = express.Router()

router.get('/task',getTask)
router.post('/add-task',addTask)
router.delete('/task', deleteMultipleTasks)
router.delete('/task/:id', deleteTask)
router.patch('/task/:id', saveTask)
router.patch('/task/:id/completed', completedTask)



module.exports = router