import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import axios from "axios";

const FacialInput = ({ onEmotionDetected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Facial Input File:", file);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/facial_emotion/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Facial emotion response:", response.data);
      if (onEmotionDetected) {
        onEmotionDetected(response.data);
      }
    } catch (err) {
      console.error("Facial emotion error:", err);
      setError(err.response?.data?.error || "Failed to process image");
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
        accept="image/*"
        style={{ display: "none" }}
        id="facial-input-file"
        type="file"
        onChange={handleFileUpload}
        disabled={loading}
      />
      <label htmlFor="facial-input-file">
        <Button
          variant="contained"
          component="span"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Processing..." : "Upload Image"}
        </Button>
      </label>
    </>
  );
};

export default FacialInput;
