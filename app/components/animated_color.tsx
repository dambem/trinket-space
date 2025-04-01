'use client';
import React, { useEffect } from 'react';

const AnimatedBackground = ({ position = "logo" }) => {
  useEffect(() => {
    // Animation function that slightly changes the filter properties
    const animateGlow = () => {
      const turbulence = document.getElementById(`noiseTurbulence-${position}`);
      const displacement = document.getElementById(`displacementEffect-${position}`);
      
      if (!turbulence || !displacement) return;
      
      let phase = 0;
      
      const animate = () => {
        phase += 0.01;
        
        // Slowly modify the baseFrequency
        const newFreq = (Math.sin(phase) * 0.1 + 1.2).toFixed(2);
        turbulence.setAttribute('baseFrequency', newFreq);
        
        // Slightly modify the displacement scale
        const newScale = (Math.sin(phase * 0.5) * 2 + 5).toFixed(1);
        displacement.setAttribute('scale', newScale);
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    // Start the animation after component mounts
    animateGlow();
    
    // Clean up on unmount
    return () => {
    };
  }, [position]);
  

  
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id={`ditheringCanvas-${position}`} width="100%" height="100%">
        <defs>
          <radialGradient id={`brightGradient-${position}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#FF3366" stop-opacity="0.6">
              <animate 
                attributeName="stop-color" 
                values="#FF3366; #FF9966; #FF3366" 
                dur="10s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="stop-opacity" 
                values="0.6; 0.5; 0.6" 
                dur="8s" 
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="40%" stop-color="#3333FF" stop-opacity="0.2">
              <animate 
                attributeName="stop-color" 
                values="#3333FF; #33CCFF; #3333FF" 
                dur="12s" 
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="70%" stop-color="#3333FF" stop-opacity="0.05" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </radialGradient>
          
          <filter id={`customDither-${position}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              id={`noiseTurbulence-${position}`} 
              type="fractalNoise" 
              baseFrequency="1.2" 
              numOctaves="5" 
              seed="5" 
              result="noise" 
            />
            
            <feComponentTransfer id={`thresholdEffect-${position}`} in="noise" result="thresholdNoise">
              <feFuncR type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
              <feFuncG type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
              <feFuncB type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
            </feComponentTransfer>
            
            <feDisplacementMap 
              id={`displacementEffect-${position}`}
              in="SourceGraphic" 
              in2="thresholdNoise" 
              scale="5" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced" 
            />
            
            <feComposite 
              id={`compositeEffect-${position}`}
              in="SourceGraphic" 
              in2="thresholdNoise" 
              operator="arithmetic" 
              k1="0.7" 
              k2="0.3" 
              k3="0.3" 
              k4="0" 
              result="composited" 
            />
            
            <feBlend 
              id={`blendEffect-${position}`}
              in="composited" 
              in2="displaced" 
              mode="normal" 
            />
            
            <feGaussianBlur 
              stdDeviation="12" 
              result="blurred" 
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.5 0"
              result="transparentBlur"
            />
            <feComposite
              in2="SourceGraphic"
              operator="in"
              result="compositedBlur"
            />
          </filter>
        </defs>
        
        <g id={`mainGraphics-${position}`}>
          {/* Add a very faint background blur */}
          <circle 
            cx="250" 
            cy="250" 
            r="160" 
            fill="url(#brightGradient-${position})" 
            opacity="0.15"
            filter="blur(15px)"
          />
          
          {/* Main circle with animation and effects */}
          <circle 
            id={`ditherCircle-${position}`} 
            cx="250" 
            cy="250" 
            r="90" 
            fill={`url(#brightGradient-${position})`} 
            filter={`url(#customDither-${position})`}
          >
            <animate 
              attributeName="r" 
              values="80;95;80" 
              dur="2s" 
              repeatCount="indefinite" 
            />
            <animate
              attributeName="opacity"
              values="0.6;0.7;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedBackground;