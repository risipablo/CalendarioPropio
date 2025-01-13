import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Grid, Button, Paper, TextField, Box, IconButton } from '@mui/material';
import { Mic, Stop, Save, Replay, Delete } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';

export const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [savedAudios, setSavedAudios] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const saveRecording = async () => {
    if (audioBlob && audioName) {
      const formData = new FormData();
      formData.append('audio', audioBlob, `${audioName}.wav`);

      try {
        const response = await axios.post(`${serverFront}/api/upload`, formData);
        setSavedAudios([...savedAudios, response.data.audio]);
        setAudioBlob(null);
        setAudioName('');
        toast.success('Audio guardado con éxito!');
      } catch (error) {
        toast.error('No se pudo guardar el audio.');
      }
    } else {
      toast.error('Por favor, proporciona un nombre para el audio.');
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioName('');
    toast('Grabación descartada.');
  };

  const fetchSavedAudios = async () => {
    try {
      const response = await axios.get(`${serverFront}/api/audios`);
      setSavedAudios(response.data);
    } catch (error) {
      console.error('Error al obtener audios:', error);
    }
  };

  const deleteAudio = async (id) => {
    try {
      const response = await axios.delete(`${serverFront}/api/audios/${id}`);
      if (response.status === 200) {
        setSavedAudios(savedAudios.filter((audio) => audio._id !== id));
        toast.success('Audio eliminado con éxito!', {
          icon: '❌',
        });
      } else {
        toast.error('Fallo en la eliminación del audio.');
      }
    } catch (error) {
      toast.error('Fallo en la eliminación del audio.');
    }
  };

  useEffect(() => {
    fetchSavedAudios();
  }, []);

  return (
    <Container maxWidth="md" sx={{ padding: 2 }} className='audio-container'>
      <Typography variant="h4" align="center" gutterBottom>
        Audio Recorder
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color={isRecording ? "error" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            startIcon={isRecording ? <Stop /> : <Mic />}
            fullWidth
            sx={{ borderRadius: 3 }}
          >
            {isRecording ? 'Pausar' : 'Grabar'}
          </Button>
        </Grid>
      </Grid>

      {audioBlob && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Audio Preview
          </Typography>
          <audio controls style={{ width: '100%' }}>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <TextField
            label="Audio Name"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <IconButton color="primary" onClick={saveRecording}>
              <Save />
            </IconButton>
            <IconButton color="secondary" onClick={discardRecording}>
              <Replay />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Audios Guardados
      </Typography>
      <Grid container spacing={2}>
        {savedAudios.map((audio) => (
          <Grid item xs={12} sm={6} md={4} key={audio._id}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="subtitle1">{audio.filename}</Typography>
              <audio controls style={{ width: '100%' }}>
                <source src={`${serverFront}/uploads/${audio.filename}`} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <Box display="flex" justifyContent="flex-end" marginTop={1}>
                <IconButton color="error" onClick={() => deleteAudio(audio._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Toaster />
    </Container>
  );
};
