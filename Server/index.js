require("dotenv").config();
const express = require('express');
const connectDB = require('./Config/dataBase');
const cors = require('cors');
const errorHandle = require('./Middleware/errorHandle');
const accionRoutes = require('./Routes/accionRoutes');
const calenderNotes = require('./Routes/calenderRoutes')
const taskRoutes = require('./Routes/taskRoutes')
const userRoutes = require('./Routes/authRoutes')

const path = require('path');


const app = express();
app.use(express.json());



const corsOptions = {
  origin: ['http://localhost:5173',,'http://localhost:5175','https://calendario-propio.vercel.app','https://calendariopropio.onrender.com'],
  optionsSuccessStatus: 200,
  methods: 'GET,POST,DELETE,PATCH',
  credentials: true,
};
app.use(cors(corsOptions));


app.use('/api', calenderNotes)
app.use('/api', accionRoutes);
app.use('/api', taskRoutes)
app.use('/api', userRoutes)


// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(errorHandle);

connectDB();



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

