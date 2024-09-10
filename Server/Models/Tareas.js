
const mongoose = require("mongoose");

const TareaSchema = new mongoose.Schema({
    task: { 
        type: String, 
        required: true,
 
     },
     descripcion : {
         type: String,
         required: true
     },
     completed: {
        type: Boolean,
        default: false,
    }
})

const TareaModel = mongoose.model("tasks", TareaSchema)
module.exports = TareaModel;