"use client"
import React, { useState } from 'react';
import { db, storage } from '../connection/firebaseConfig'; // Ensure this path is correct
import { addDoc, collection } from 'firebase/firestore'; // Import necessary Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Storage functions

async function addDataToFirestore(email, imageUrl) {
    try {
        const docRef = await addDoc(collection(db, "sampletextfield"), {
            email: email,
            followedAt: new Date().toISOString(),
            imageUrl: imageUrl // Save the image URL in Firestore
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }
}

function Sample() {
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null); // State for image file

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]); // Set selected image file
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (email && image) {
            // Upload the image to Firebase Storage
            const imageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(imageRef, image);
            
            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(imageRef);
            
            // Add data to Firestore with the image URL
            const success = await addDataToFirestore(email, imageUrl);
            if (success) {
                setEmail('');
                setImage(null); // Clear the image selection
                alert('Data saved successfully!');
            } else {
                alert('Failed to save data.');
            }
        } else {
            alert('Please enter an email and select an image.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
                required 
            />
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
            />
            <button type="submit">Save</button>
        </form>
    );
}

export default Sample;
