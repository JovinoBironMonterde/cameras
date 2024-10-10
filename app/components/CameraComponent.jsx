"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js"; // Import face-api.js

const CameraComponent = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false); // Track if image has been captured

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; // Adjust to correct path
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded successfully");
      } catch (err) {
        setError("Error loading models: " + err.message);
      }
    };

    const initialize = async () => {
      await loadModels();
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            setError("Error accessing the camera. Please make sure it's allowed.");
          });
      } else {
        setError("Camera not supported on this device.");
      }
    };
    initialize();

    const detectFace = async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptors();

        console.log("Detections:", detections);
        if (detections.length > 0) {
          if (!hasCaptured) { // Capture if not already captured
            setIsFaceDetected(true);
            captureImage(); // Capture the image when a face is detected
            setHasCaptured(true); // Prevent further captures
          }
        } else {
          setIsFaceDetected(false);
        }
      }
    };

    const faceDetectionInterval = setInterval(() => {
      detectFace();
    }, 200);

    return () => clearInterval(faceDetectionInterval);
  }, [hasCaptured]); // Dependency on hasCaptured

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Create a blob from the canvas and pass it to the parent component (FirebaseImageUpload)
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob); // Send captured blob to parent component
        } else {
          console.error("Failed to create blob from canvas");
        }
      }, "image/jpeg"); // You can change "image/jpeg" to "image/png" if needed
    }
  };

  return (
    <div>
      <h1>Face Detection Auto Capture</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay muted style={{ width: "300px" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      {isFaceDetected && <p>Face detected! Capturing image...</p>}
    </div>
  );
};

export default CameraComponent;
