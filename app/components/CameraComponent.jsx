"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js"; // Import face-api.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { storage, db } from "../connection/firebaseConfig"; // Import Firestore and Storage

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false); // Track if image has been captured
  const [textareaValue, setTextareaValue] = useState(""); // State for textarea
  const [latestBlob, setLatestBlob] = useState(null); // Store the latest blob

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

        // console.log("Detections:", detections);
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
  
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("Blob created successfully:", blob);
          setLatestBlob(blob);
          uploadImageToFirebase(blob);
        } else {
          console.error("Failed to create blob from canvas");
        }
      }, "image/jpeg");
    } else {
      console.error("Video or canvas reference is null");
    }
  };

  const uploadImageToFirebase = (blob) => {
    if (!blob) {
      console.error("No valid blob to upload.");
      return; // Check if blob is valid
    }
    
    console.log("Uploading blob:", blob);
    setUploading(true);
    const timestamp = Date.now();
    const storageRef = ref(storage, `images/${timestamp}.jpg`);
  
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Upload successful!", snapshot);
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        // Rest of your code...
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      })
      .finally(() => {
        setUploading(false);
      });
  };
  
  
  

  // Handle textarea change
  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value); // Update state with textarea value
  };

  return (
    <div>
      <h1>Face Detection Auto Capture</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay muted style={{ width: "100%" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {uploading && <p>Uploading...</p>}
          {imageURL && (
            <div>
              <p>Image uploaded successfully:</p>
              <img src={imageURL} alt="Captured" style={{ width: "100%" }} />
            </div>
          )}
        </div>
      )}
      {isFaceDetected && <p>Face detected! Capturing image...</p>}
      <textarea
        value={textareaValue} // Bind the textarea value to state
        onChange={handleTextareaChange} // Handle changes
        placeholder="Enter your text here..."
      />
      <button onClick={() => {
        if (latestBlob) {
          uploadImageToFirebase(latestBlob); // Upload the latest captured blob
        } else {
          alert("No image captured to upload!");
        }
      }}>
        Save
      </button>
    </div>
  );
};

export default CameraComponent;
