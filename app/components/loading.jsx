import React from 'react'
import '../globals.css'

function Loading() {
  return (
    <div>
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-solid"></div>
    </div>
    </div>
  );
}

export default Loading;
