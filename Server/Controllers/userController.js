
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

exports.registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const existingUser = await userModel.find({email})
        const existingName = await userModel.find({name})
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }
        if (existingName.length > 0) {
            return res.status(400).json({ message: 'El nombre ya está en uso' });
        }

        const newUser = new userModel({ email, name, password });
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password,name } = req.body;

    // Validar los campos requeridos
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',   
        });

        res.json({ message: 'Inicio de sesión exitoso', token }); 
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor: ' + err.message });
    }
};

exports.logoutUser = (req, res) => {
   
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
    });
    res.json({ message: 'Cierre de sesión exitoso' });
};
