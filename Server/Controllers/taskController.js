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
    const { date, description } = req.body;

    if (!date || !description ) 
        return res.status(400).json({ error: 'Se requieren todos los campos' });

    try {
        const newTask = new taskModel({ date, description });
        const result = await newTask.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};




exports.completedTask = async (req,res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
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
    const {date,description} = req.body;

    if (!date || !description) {
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        const saveAccions = await taskModel.findByIdAndUpdate(id, { date, description }, { new:true })
        if (!saveAccions){
            return res.status(404).json({error: "Tarea no encontrada"})
        }
        res.json(saveAccions)
    }
    catch (err){
        res.status(500).json({error: err.message})
    }
}


//Eliminar una tarea por vez

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



// Eliminar múltiples tareas
exports.deleteMultipleTasks = async (req, res) => {
    const { ids } = req.body; // Espera un array de IDs

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Se requiere un array de IDs" });
    }

    try {
        // Elimina todas las tareas cuyos IDs estén en el array
        const result = await taskModel.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} tareas eliminadas`, result });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};


// Eliminar todas las tareas

exports.deleteAllTask = async (req, res) => {
    try {
        const result = await taskModel.deleteMany({});
        res.json({ message: 'Todas las tareas han sido eliminadas', result });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};
