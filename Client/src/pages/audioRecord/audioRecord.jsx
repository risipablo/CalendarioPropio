import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Typography, Grid, IconButton, Paper, Box, TextField } from '@mui/material';
import { Mic, Stop, Save, Delete, Replay } from '@mui/icons-material';

// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com'

const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioName, setAudioName] = useState('')
  const [savedAudios, setSavedAudios] = useState([])
  const mediaRecorderRef = useRef(null)
  const audioChunks = useRef ([])

  // comenzar a grabar
  const startRecording = async () => {
    try{
      // solicitar permiso para acceder al microfono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // permite grabar el audio 
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // capturar los datos de audio
      mediaRecorderRef.current.ondataavailable = (event) => {
        if(event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      // audios grabados
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {type: 'audio/wav'})
        setAudioBlob(audioBlob) // se guarda en el estado de audio blob
        audioChunks.current = []  // se limpiar el array
      }

      // empezar a grabar
      mediaRecorderRef.current.start()
      setIsRecording(true) // se actualiza el estado
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
    }
  }


  // detener la grabacion
  const stopRecording = () => {
    // comprobar si el media existe
    if(mediaRecorderRef.current) {
      mediaRecorderRef.current.stop() // detiene el proceso de grabacion
    }
    setIsRecording(false)
  }

  // guardar audios
  const saveRecording = async () => {
    if (audioBlob && audioName) {
      const formData = new FormData();
      formData.append('audio', audioBlob, `${audioName}.wav`);

      const response = await fetch(`${serverFront}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAudios([...savedAudios, data.audio]);
        setAudioBlob(null);
        setAudioName('');
        alert('Audio saved successfully!');
      } else {
        alert('Failed to save audio.');
      }
    } else {
      alert('Please provide a name for the audio.');
    }
  };

  // anular grabacion
  const discardRecording = () => {
    setAudioBlob(null)
    setAudioName('')
  }

  // guardar audio en base de datos
  const fetchSavedAudios = async () => {
    const response = await fetch(`${serverFront}/api/audios`);
    const data = await response.json();
    setSavedAudios(data);
  };


  // eliminar audio 
  const deleteAudio = async (id) => {
    const response = await fetch(`${serverFront}/api/audios/${id}`, {
      method: 'DELETE',
    })

    // si la solicitud es exitosa se el filtra el id del audio que se desea eliminar
    if (response.ok){
      setSavedAudios(savedAudios.filter(audio => audio._id !== id))
      alert('Audio eliminado con exito')
    } else {
      alert ('Fallo en la eliminacion de audio')
    }
  }

useEffect(() => {
    fetchSavedAudios();
  }, []);


  return (
    <Container maxWidth="md" sx={{ padding: 2 }}>
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
        {savedAudios.map(audio => (
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
    </Container>
  );
};

export default AudioRecord;


  


