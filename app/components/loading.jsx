import React from 'react'
import '../globals.css'

function Loading() {
  return (
    <div>
        <div>
            <div className="beforreOverly"> 
                <h1>Please wait...</h1>
                <h5>Click allow camera to view the image</h5>
            </div>
        </div>
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-solid"></div>
    </div>
    </div>
  );
}

export default Loading;
