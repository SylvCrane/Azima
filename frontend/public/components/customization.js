



document.addEventListener("edit", function () {
  const assetsContainer = document.querySelector("a-assets");
  const scrollContainer = document.getElementById("scroll-container");
  const cameraEl = document.querySelector('[camera]');
 const cursorRing = document.getElementById('cursorRing');
  let imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  let caption = document.createElement('span');
  caption.className = 'caption';
  let asset = document.createElement("img");
  let select = document.getElementById("scroll");
  let selected;
  // Change the background color of the container when the color wheel changes.
 
  
 let  sceneEl=   document.querySelector('a-scene');
 sceneEl.addEventListener('fovChanged', (evt) => {
  console.log(evt.detail.fov);
  if (evt.detail.fov === 80) {
   console.log("step inside");
   cursorRing.setAttribute('scale', `1`);
    cursorRing.setAttribute("geometry", {
      radiusOuter: 0.03,
      radiusInner: 0.02,
    });

  }else{
    console.log("step inside 2");
    updateCursorScale(evt.detail.fov);
  }
  });
  
  

select.addEventListener('click', (e) => {
 asset.src = e.target.src;
 asset.id = e.target.id;
});


  
document.getElementById("saveButton").addEventListener("click", function () {
  console.log("Save button clicked.");  // Logs when the button is clicked

  let event = new Event("save");  // Create a 'save' event
  let sky = document.querySelector("a-sky");  // Find the <a-sky> element
  let tab = document.getElementById('tab');  // Find the 'tab' element
  let assetsContainer = document.querySelector("a-assets");  // Find the assets container

  console.log("Checking if asset ID and source are set");  // Log before checking asset conditions
  if (asset.id && asset.src) {
      console.log("Asset ID and src are set, dispatching save event.");  // Log if conditions are met
      document.body.dispatchEvent(event);  // Dispatch the 'save' event
      assetsContainer.appendChild(asset);  // Append asset to the assets container
      console.log("Asset appended to assetsContainer:", assetsContainer);
      console.log("Saved sent with asset src:", asset.src);  // Log asset source
      tab.style.display = '';  // Adjust display of the 'tab' element
      asset = document.createElement("img");  // Reset the asset element
  } else {
      console.log("Asset id or src is not set");  // Log if asset conditions are not met
  }
});
  document.getElementById("cancelButton").addEventListener("click", function () {
    let tab = document.getElementById('tab');
    let event = new Event("cancel");
    tab.style.display ='';
    document.body.dispatchEvent(event);
  });
  document.getElementById("zoomInBtn").addEventListener("click", function () {
    // Access the A-Frame scene
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) {
      console.error('A-Frame scene not found!');
      return;
    }
    
    // Access the active camera entity. Since A-Frame 0.7.0, you should use sceneEl.systems.camera.activeCameraEl
    const cameraEl = sceneEl.systems.camera.activeCameraEl;
    
    if (!cameraEl) {
      console.error('Camera entity not found!');
      return;
    }
  
    // Get the current FOV from the camera
    let currentFov = cameraEl.getAttribute('camera').fov;
    
    // Define how much you want to zoom in, for example, decrease FOV by 5
    let newFov = currentFov - 5;
    
    // Ensure the new FOV is within a reasonable range to prevent distortion
    newFov = Math.max(10, newFov); // Don't allow the FOV to go below 10
    
    // Update the camera's FOV
    cameraEl.setAttribute('camera', 'fov', newFov);
    updateCursorScale(newFov);
  });
  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    // Access the A-Frame scene
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) {
      console.error('A-Frame scene not found!');
      return;
    }
    
    // Access the active camera entity
    const cameraEl = sceneEl.systems.camera.activeCameraEl;
    
    if (!cameraEl) {
      console.error('Camera entity not found!');
      return;
    }
  
    // Get the current FOV from the camera
    let currentFov = cameraEl.getAttribute('camera').fov;
    
    // Define how much you want to zoom out, for example, increase FOV by 5
    let newFov = currentFov + 5;
    
    // Ensure the new FOV is within a reasonable range to prevent distortion
    // For example, the FOV shouldn't be more than 80 to avoid a fish-eye effect
    newFov = Math.min(newFov, 80);
    
    // Update the camera's FOV
    cameraEl.setAttribute('camera', 'fov', newFov);
    updateCursorScale(newFov);
  });
  
  

});
function updateCursorScale(fov) {

  const cursorRing = document.getElementById('cursorRing');
  const baseFov = 20;
  const baseScale = 1;
  
  // Calculate the new scale based on the change in FOV
  const scale = baseScale * (fov / baseFov);


  cursorRing.setAttribute('scale', `${scale} ${scale} ${scale}`);


}
