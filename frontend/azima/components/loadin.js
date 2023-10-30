document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById('overlay');
    
    // Ensure the initial opacity is set to '1'
    overlay.style.opacity = '1';
    
    // Listen for the end of the transition to change the z-index
    overlay.addEventListener('transitionend', function() {
      overlay.style.zIndex = '0';
    });
    
    // Delay the fade-out to give the transition time to apply
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 500); // Delay can be minimal since we're just waiting for the next frame
  });
  