require("dotenv").config();
const express = require('express');
const connectDB = require('./Config/dataBase');
const cors = require('cors');
const errorHandle = require('./Middleware/errorHandle');
const accionRoutes = require('./Routes/accionRoutes');
const calenderRoutes = require('./Routes/calenderRoutes')
const taskRoutes = require('./Routes/taskRoutes')
// const helmet = require('helmet');
// const morgan = require('morgan');

const app = express();
app.use(express.json());
// app.use(helmet()); // Mejora la seguridad de tu aplicación
// app.use(morgan('dev')); // Log de solicitudes


const corsOptions = {
  origin: ['http://localhost:5173','https://calendario-propio.vercel.app','https://calendariopropio.onrender.com'],
  optionsSuccessStatus: 200,
  methods: 'GET,POST,DELETE,PATCH',
  credentials: true,
};
app.use(cors(corsOptions));


app.use('/api', calenderRoutes)
app.use('/api', accionRoutes);
app.use('/api', taskRoutes)
app.use(errorHandle);

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

