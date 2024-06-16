
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
    },
    order: { 
        type: Number,
         default: 0 
        } 
})

const TareaModel = mongoose.model("tasks", TareaSchema)
 = TareaModel;