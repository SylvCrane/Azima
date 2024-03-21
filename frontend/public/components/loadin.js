
document.addEventListener("DOMContentLoaded", function() {


  const params = new URLSearchParams(window.parent.location.search);
  console.log(params);
const houseID = params.get('houseID');
console.log("houseid: ",houseID)
  
  loadImageData(houseID);
  loadPortalData(houseID);
  loadWIPPortalData(houseID);
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
    
    }, 1000) // Delay can be minimal since we're just waiting for the next frame
  });



  function loadImageData(houseId) {
    fetch('http://localhost:8082/api/house/house/puller/' + houseId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json(); // Parse the JSON of the response
        })
        .then(data => {
            console.log('House loaded successfully:', data);

            const assetsEl = document.querySelector('a-assets');

            if (assetsEl && Array.isArray(data[0].images)) {
                data[0].images.forEach((image) => {
                    // Create a new <img> element for each image
                    let imgEl = document.createElement("img");
                    imgEl.setAttribute("id", `${image.name}`);
                    imgEl.setAttribute("src", image.imageURL);

                    // Append the <img> element to the <a-assets> element
                    assetsEl.appendChild(imgEl);
                });

                console.log('All images added to <a-assets>.', assetsEl);

                // Assuming the data is an array of image URLs, and you want the first one
                const firstImageUrl = data[0].images[0].imageURL;
                const skyEl = document.querySelector('a-sky');

                if (skyEl && firstImageUrl) {
                    skyEl.setAttribute('src', firstImageUrl);
                    skyEl.setAttribute('class', data[0].images[0].name);
                    console.log('Sky image updated successfully with:', firstImageUrl);
                }
            }
        })
        .catch(error => {
            console.error('Failed to load image data:', error);
        });
}



  function loadPortalData(houseId) {
    fetch('http://localhost:8082/api/house/house/puller/' + houseId)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json(); // Parse the JSON of the response
    })
    .then(data => {
      console.log('House loaded successfully:', data[0].portals);
        const sceneEl = document.querySelector('a-scene');
        
        if (sceneEl && Array.isArray(data[0].portals)&&data[0].portals.length>0) { // Ensure data is an array
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
                    
                }, 100);
            }
          });
        }
    })
    .catch(error => {
        console.error('Failed to load portal data:', error);
    });
}

function loadWIPPortalData(houseId) {
  fetch('http://localhost:8082/api/portal/'+houseId)
  .then(response => {
      if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
      }
      return response.json(); // Parse the JSON of the response
  })
  .then(data => {
    console.log('House loaded successfully:', data[0]);
      const sceneEl = document.querySelector('a-scene');
      
      if (sceneEl && Array.isArray(data)&&data.length>0) { // Ensure data is an array
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
                  
              }, 100);
          }
        });
      }
  })
  .catch(error => {
      console.error('Failed to load portal data:', error);
  });
}
