import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import axios from "axios";

const SpeechInput = ({ onEmotionDetected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Speech Input File:", file);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/speech_emotion/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Speech emotion response:", response.data);
      if (onEmotionDetected) {
        onEmotionDetected(response.data);
      }
    } catch (err) {
      console.error("Speech emotion error:", err);
      setError(err.response?.data?.error || "Failed to process audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <input
        accept="audio/*"
        style={{ display: "none" }}
        id="speech-input-file"
        type="file"
        onChange={handleFileUpload}
        disabled={loading}
      />
      <label htmlFor="speech-input-file">
        <Button
          variant="contained"
          component="span"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Processing..." : "Upload Audio"}
        </Button>
      </label>
    </>
  );
};

export default SpeechInput;
