
const mongoose = require("mongoose");

const accionesSchema = new mongoose.Schema({
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

const accionModel = mongoose.model("acciones", accionesSchema)
module.exports = accionModel;