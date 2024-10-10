// components/Camera.js
"use client";
import React, { useRef, useEffect } from 'react';

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const getMedia = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();

            // Auto-capture after 5 seconds
            const autoCaptureTimer = setTimeout(() => {
                captureImage();
            }, 5000); // Adjust the time in milliseconds

            // Cleanup function to stop the video stream and clear the timer
            return () => {
                clearTimeout(autoCaptureTimer);
                if (videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach((track) => track.stop());
                }
            };
        };

        getMedia();
    }, []);

    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        // Send image data to server or Gmail
        sendImageToGmail(imageData);
    };

    const sendImageToGmail = async (imageData) => {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });
        if (response.ok) {
            console.log('Image sent to Gmail!');
        } else {
            console.error('Failed to send image.');
        }
    };

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <button onClick={captureImage}>Capture Image</button>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default Camera;
