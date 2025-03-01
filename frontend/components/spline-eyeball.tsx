// frontend/components/spline-eyeball.tsx
'use client';

import React, { useEffect } from 'react';

export default function SplineEyeball() {
  useEffect(() => {
    // Load the Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer/build/spline-viewer.js';
    document.head.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
   <div className="mx-auto mb-4 h-100">
      <spline-viewer 
        url="https://prod.spline.design/d2GA12iz7Qmw1Y2y/scene.splinecode" 
        events-target="global"
      ></spline-viewer>
    </div>
  );
}