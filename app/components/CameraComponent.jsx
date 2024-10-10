"use client"
import React, { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Import Firebase storage

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    // Access the user's camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } }) // For rear camera
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
          setError("Error accessing the camera. Please make sure it's allowed.");
        });
    } else {
      setError("Camera not supported on this device.");
    }

    // Set interval to auto-capture every 5 seconds (or adjust as needed)
    const captureInterval = setInterval(() => {
      captureImage();
    }, 5000);

    return () => clearInterval(captureInterval); // Clean up interval on component unmount
  }, []);

  // Capture the image from the video stream
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a blob (image)
      canvas.toBlob((blob) => {
        if (blob) {
          // Upload the blob to Firebase
          uploadImageToFirebase(blob);
        }
      }, "image/jpeg");
    }
  };

  // Upload image blob to Firebase
  const uploadImageToFirebase = (blob) => {
    setUploading(true);
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        // Get the download URL of the uploaded image
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          setUploading(false);
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setUploading(false);
      });
  };

  return (
    <div>
      <h1>Auto Capture & Save to Firebase</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay style={{ width: "100%" }} />
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
    </div>
  );
};

export default CameraComponent;
