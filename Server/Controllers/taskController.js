const taskModel = require('../Models/task');

exports.getTask = async (req, res) => {
    try {
        const tasks = await taskModel.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTask = async (req, res) => {
    const { day, description, month } = req.body;

    if (!day || !description || !month) 
        return res.status(400).json({ error: 'Se requieren todos los campos' });

    try {
        const newTask = new taskModel({ day, description, month });
        const result = await newTask.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const taskDelete = await taskModel.findById(id);
        if (!taskDelete) {
            return res.status(404).json({ error: "Task not found" });
        }

        const result = await taskModel.findByIdAndDelete(id)
        res.json({ message: 'tarea eliminada', result})

    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};

exports.completedTask = async (req,res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    if (typeof completed !== 'boolean'){
        return res.status(400).json({error:'Error'})
    }
      
    try{
        const updatedTask = await taskModel.findByIdAndUpdate(id, {completed}, {new:true})
        if (!updatedTask){
            return res.status(404).json({ error: "Tarea no encontrada"})
        }
         res.json(updatedTask)

    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

exports.saveTask = async (req,res) => {
    const {id} = req.params;
    const {day,month,description} = req.body;

    if (!day || !month || !description) {
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        const saveAccions = await taskModel.findByIdAndUpdate(id, { day , month , description }, { new:true })
        if (!saveAccions){
            return res.status(404).json({error: "Tarea no encontrada"})
        }
        res.json(saveAccions)
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}