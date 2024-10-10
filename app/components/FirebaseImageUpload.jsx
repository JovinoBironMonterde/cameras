"use client";
import React, { useState, useEffect } from "react";
import { imageDb } from '../connection/firebaseConfig';  // Use Firebase Storage
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import CameraComponent from './CameraComponent'; // Import CameraComponent
import Loading from './loading'; // Import the spinner component

function FirebaseImageUpload() {
    const [imgBlob, setImgBlob] = useState(null); // Store captured image blob
    const [imgUrl, setImgUrl] = useState([]);

    // Auto-upload whenever a new image blob is set
    useEffect(() => {
        if (imgBlob) {
            const handleUpload = () => {
                const imgRef = ref(imageDb, `files/${v4()}`);
                uploadBytes(imgRef, imgBlob).then(value => {
                    getDownloadURL(value.ref).then(url => {
                        setImgUrl(data => [...data, url]);
                    });
                });
            };
            handleUpload(); // Automatically upload image when it's captured
        }
    }, [imgBlob]); // This effect runs whenever imgBlob changes

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }, []);

    return (
        <div className="App">
            <div className="cameraClass">
            <CameraComponent onCapture={setImgBlob} /> 
          
            
            {imgUrl.map((dataVal, index) => (
                <div key={index}>
                    <img src={dataVal} height="200px" width="200px" alt={`Uploaded ${index}`} />
                </div>
            ))}
            </div>
            {/* <div className="Overly">
            {isLoading ? <Loading /> : <div className="text">Wait to load the image...</div>}
            </div> */}
        </div>

    );
}

export default FirebaseImageUpload;
