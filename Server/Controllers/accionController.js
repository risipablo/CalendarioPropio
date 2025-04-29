const accionModel = require('../Models/acciones')

exports.getAcciones = async (req,res) => {
    try {
        const acciones = await accionModel.find()
        res.json(acciones)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.addAccion = async (req,res) => {
    const { task, descripcion } = req.body;
  
    if (!task || !descripcion) {
      return res.status(400).json({ error: "Task and description are required" });
    }
    
    try {
      const nuevaAccion = new accionModel({ task, descripcion });
      const result = await nuevaAccion.save();
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
}

exports.deleteAccion = async (req, res) => {
    const { id } = req.params;
    
    try {
        const accion = await accionModel.findById(id);
        
        if (!accion) {
            return res.status(404).json({ error: "Action not found" });
        }
        
        const result = await accionModel.findByIdAndDelete(id);
        res.json({ message: "Action deleted successfully", result });
    } catch (err) {
        console.error("Error deleting action:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.patchAccion = async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: "Completed status is required and should be a boolean" });
    }
    
    try {
      const updatedTask = await accionModel.findByIdAndUpdate(id, { completed }, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


exports.saveAccion = async (req, res) => {
  const { id } = req.params;
  const { task, descripcion } = req.body;

  if (!task || !descripcion) {
      return res.status(400).json({ error: "Task and description are required" });
  }

  try {
      const saveTask = await accionModel.findByIdAndUpdate(id, { task, descripcion }, { new: true });
      if (!saveTask) {
          return res.status(404).json({ error: "Nota no encontrada" });
      }
      res.json(saveTask);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


exports.deleteAll = async (req, res) => {
    try {
        const result = await accionModel.deleteMany({});
        res.json({ message: "Todas las acciones eliminadas", result });
    } catch (err) {
        console.error("Error al eliminar las acciones", err);
        res.status(500).json({ error: "Server error" });
    }
}