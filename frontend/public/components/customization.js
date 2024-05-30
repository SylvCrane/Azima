/**
 * customization.js
 * Description: Manages the customization of a portal's features in the A-Frame scene, including color changes, field of view (FOV) adjustments, and event handling for saving or cancelling customizations.
 */

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

  let sceneEl = document.querySelector('a-scene');
  
  /**
   * FOV Change Event Listener
   * Listens for fovChanged events on the a-scene element. Adjusts the cursor ring's scale based on the new FOV value.
   */
  sceneEl.addEventListener('fovChanged', (evt) => {
    if (evt.detail.fov === 80) {
      cursorRing.setAttribute('scale', `1`);
      cursorRing.setAttribute("geometry", {
        radiusOuter: 0.03,
        radiusInner: 0.02,
      });
    } else {
      updateCursorScale(evt.detail.fov);
    }
  });

  /**
   * Image Selection Event Listener
   * Listens for click events on the select element. Sets the source and ID of the asset to the clicked target's source and ID.
   */
  select.addEventListener('click', (e) => {
    asset.src = e.target.src;
    asset.id = e.target.id;
  });

  /**
   * Save Button Event Listener
   * Listens for click events on the saveButton element. Dispatches a save event, appends the asset to the assets container, and adjusts the display of the tab element.
   */
  document.getElementById("saveButton").addEventListener("click", function () {
    let event = new Event("save");
    let sky = document.querySelector("a-sky");
    let tab = document.getElementById('tab');

    if (asset.id && asset.src) {
      document.body.dispatchEvent(event);
      assetsContainer.appendChild(asset);
      tab.style.display = '';
      asset = document.createElement("img");
    }
  });

  /**
   * Cancel Button Event Listener
   * Listens for click events on the cancelButton element. Dispatches a cancel event and resets the display of the tab element.
   */
  document.getElementById("cancelButton").addEventListener("click", function () {
    let tab = document.getElementById('tab');
    let event = new Event("cancel");
    tab.style.display = '';
    document.body.dispatchEvent(event);
  });

  /**
   * Zoom In Button Event Listener
   * Listens for click events on the zoomInBtn element. Decreases the camera's FOV by a specified amount, ensuring it remains within a reasonable range to prevent distortion.
   */
  document.getElementById("zoomInBtn").addEventListener("click", function () {
    const sceneEl = document.querySelector('a-scene');
    const cameraEl = sceneEl.systems.camera.activeCameraEl;

    let currentFov = cameraEl.getAttribute('camera').fov;
    let newFov = currentFov - 5;
    newFov = Math.max(10, newFov);

    cameraEl.setAttribute('camera', 'fov', newFov);
    updateCursorScale(newFov);
  });

  /**
   * Zoom Out Button Event Listener
   * Listens for click events on the zoomOutBtn element. Increases the camera's FOV by a specified amount, ensuring it does not exceed a maximum value to avoid a fish-eye effect.
   */
  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    const sceneEl = document.querySelector('a-scene');
    const cameraEl = sceneEl.systems.camera.activeCameraEl;

    let currentFov = cameraEl.getAttribute('camera').fov;
    let newFov = currentFov + 5;
    newFov = Math.min(newFov, 80);

    cameraEl.setAttribute('camera', 'fov', newFov);
    updateCursorScale(newFov);
  });

});

/**
 * updateCursorScale(fov)
 * Updates the scale of the cursor ring based on the current FOV of the camera.
 * Calculates the new scale using a base FOV and scale to ensure the cursor ring's size adjusts appropriately with changes in the camera's FOV.
 * 
 * @param {number} fov - The current field of view (FOV) of the camera.
 */
function updateCursorScale(fov) {
  const cursorRing = document.getElementById('cursorRing');
  const baseFov = 20;
  const baseScale = 1;

  const scale = baseScale * (fov / baseFov);
  cursorRing.setAttribute('scale', `${scale} ${scale} ${scale}`);
}