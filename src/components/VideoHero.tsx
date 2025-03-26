import React, { useRef, useState, useEffect } from 'react';

interface VideoHeroProps {
  height?: string;
  showContent?: boolean;
}

export default function VideoHero({ 
  height = "h-[80vh]", 
  showContent = true 
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [fadeInImage, setFadeInImage] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Set video to the last frame
      if (video.duration) {
        video.currentTime = video.duration - 0.1;
      }
      video.pause();
      setVideoEnded(true);
      
      // After a short delay, start fading in the image
      setTimeout(() => {
        setFadeInImage(true);
      }, 500);
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className={`relative ${height} ${showContent ? 'mt-8' : ''}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Video element with fixed opacity */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-5000 ${fadeInImage ? 'opacity-0' : 'opacity-100'}`}
          playsInline
          autoPlay
          muted
          loop={false}
          poster="https://i.postimg.cc/brBdH22D/Maitri-Liverpool-20231102-003.jpg"
        >
          <source 
            src="/alisonmaitri_hd.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Fallback/fade-in image */}
        <img
          src="https://i.postimg.cc/brBdH22D/Maitri-Liverpool-20231102-003.jpg"
          alt="Maitri Liverpool Hero"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-5000 ${fadeInImage ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Fixed opacity overlay to prevent flickering during scroll */}
        <div className="absolute inset-0 bg-black bg-opacity-50" style={{ pointerEvents: 'none' }}></div>
      </div>
      {showContent && (
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Welcome to <span className="text-yellow-400">Maitri Liverpool</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                At Maitri we believe that everyone can benefit from holistic treatments. We offer a variety of therapies which will be tailor made for each client.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}