import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Typography, Grid, IconButton, Paper, Box } from '@mui/material';
import { Mic, Stop, Save, Delete, Replay } from '@mui/icons-material';


// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com'


const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
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
    if (audioBlob) {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(`${serverFront}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAudios([...savedAudios, data.audio]);
        setAudioBlob(null);
        alert('Audio saved successfully!');
      } else {
        alert('Failed to save audio.');
      }
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
  };

  const fetchSavedAudios = async () => {
    const response = await fetch(`${serverFront}/api/audios`);
    const data = await response.json();
    setSavedAudios(data);
  };

  const deleteAudio = async (id) => {
    const response = await fetch(`${serverFront}/api/audios/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setSavedAudios(savedAudios.filter(audio => audio._id !== id));
      alert('Audio deleted successfully!');
    } else {
      alert('Failed to delete audio.');
    }
  };

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
            {isRecording ? 'Stop Recording' : 'Start Recording'}
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
        Saved Audios
      </Typography>

      {savedAudios.length > 0 ? (
        <Grid container spacing={2}>
          {savedAudios.map(audio => (
            <Grid item xs={12} sm={6} md={4} key={audio._id}>
              <Paper elevation={2} sx={{ padding: 2 }}>
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
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No saved audios yet.
        </Typography>
      )}
    </Container>
  );
};

export default AudioRecord;
