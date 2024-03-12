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

    }, 500);
    setTimeout(()=>{
      document.dispatchEvent(new Event('load'));
    }, 1000) // Delay can be minimal since we're just waiting for the next frame
  });
  function loadPortalData() {
    fetch('http://localhost:8082/api/portal/')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json(); // Parse the JSON of the response
    })
    .then(data => {
        console.log('Portal data loaded successfully:', data);
        const sceneEl = document.querySelector('a-scene');
        
        if (sceneEl && Array.isArray(data)) { // Ensure data is an array
          data.forEach((windowData, index) => {
            let windowEntity = document.createElement("a-entity");
            windowEntity.setAttribute("loader", "");
            windowEntity.setAttribute("id", `window-${index}`);


            sceneEl.appendChild(windowEntity);
            
            // Ensure the entity is part of the scene before emitting the event
            if (sceneEl.contains(windowEntity)) {
                // Use setTimeout to ensure the DOM has updated
                setTimeout(() => {
                  sceneEl.emit('loadWindows', { detail: { id: `window-${index}`, data: windowData } }, false);
                    console.log("loadWindows event emitted with ", windowData, "for ", windowEntity.id);
                }, 100);
            }
          });
        }
    })
    .catch(error => {
        console.error('Failed to load portal data:', error);
    });
}
loadPortalData();