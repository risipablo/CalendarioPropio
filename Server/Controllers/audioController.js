const fs = require('fs');
const path = require('path');
const audioModel = require('../models/audioModel');

exports.uploadAudio = async (req, res) => {
  try {
    const { filename, path: filepath } = req.file;
    const { name } = req.body;

    const newAudio = new audioModel({ name, filename, filepath });
    await newAudio.save();

    res.status(200).json({ message: 'Audio subido correctamente', audio: newAudio });
  } catch (err) {
    res.status(500).json({ message: 'Error al subir el audio', err });
  }
};

exports.getAudios = async (req, res) => {
  try {
    const audios = await audioModel.find();
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener audios', err });
  }
};

exports.deleteAudio = async (req, res) => {
  try {
    const audio = await audioModel.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ message: 'Audio no encontrado' });
    }

    // Eliminar el archivo físico
    fs.unlinkSync(audio.filepath);

    // Eliminar el registro de la base de datos
    await audio.deleteOne();

    res.status(200).json({ message: 'Audio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el audio', error });
  }
};