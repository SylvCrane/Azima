import React, {useEffect, useState} from 'react';

const Overlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
    id="overlay"
    style={{
      opacity: isVisible ? '1' : '0',
      zIndex: isVisible ? '10' : '0',

    }}
    ></div>
  );
};

export default Overlay;


// document.addEventListener( window.onload, function() {
//     const overlay = document.getElementById('overlay');
    
//     // Ensure the initial opacity is set to '1'
//     overlay.style.opacity = '1';
    
//     // Listen for the end of the transition to change the z-index
//     overlay.addEventListener('transitionend', function() {
//       overlay.style.zIndex = '0';
//     });
    
//     // Delay the fade-out to give the transition time to apply
//     setTimeout(() => {
//       overlay.style.opacity = '0';
//     }, 500); // Delay can be minimal since we're just waiting for the next frame
//   });
  