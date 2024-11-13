const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true
    },
    month:{
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;
