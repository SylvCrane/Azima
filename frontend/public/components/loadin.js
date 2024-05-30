/**
 * loadin.js
 * Description: Manages the initial loading process for the Azima platform, including loading house images, portals, and work-in-progress (WIP) portals. It also handles the overlay transition effect.
 */

document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.parent.location.search);
  const houseID = params.get('houseID');
  console.log("houseid: ", houseID);

  loadImageData(houseID);
  loadPortalData(houseID);
  loadWIPPortalData(houseID);

  const overlay = document.getElementById('overlay');
  overlay.style.opacity = '1'; // Ensure the initial opacity is set to '1'

  /**
   * fadeOutOverlay()
   * Handles the transition of the overlay by setting its opacity to 0 and changing its z-index after the transition ends.
   */
  function fadeOutOverlay() {
    /**
     * transitionend Event Listener
     * Listens for the end of the transition to change the z-index of the overlay.
     */
    overlay.addEventListener('transitionend', function() {
      overlay.style.zIndex = '0';
    });

    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 500);
  }

  /**
   * loadImageData(houseId)
   * Fetches image data for the specified house and appends each image to the A-Frame assets element.
   * Updates the sky element with the first image and sets up a hidden canvas for image processing.
   * @param {string} houseId - The ID of the house to load images for.
   */
  function loadImageData(houseId) {
    let counter = 0;
    fetch('https://azimatours.onrender.com/api/house/house/puller/' + houseId)
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
          const totalImages = data[0].images.length;

          data[0].images.forEach((image) => {
            let imgEl = document.createElement("img");
            imgEl.setAttribute("id", `${image.name}`);
            imgEl.setAttribute("src", image.imageURL);
            imgEl.setAttribute("crossorigin", "anonymous");

            assetsEl.appendChild(imgEl);

            /**
             * load Event Listener
             * Listens for the load event on each image element to track the loading progress and update the entity material.
             */
            imgEl.addEventListener('load', function() {
              console.log('Image loaded successfully:', imgEl);
              counter++;

              if (counter === totalImages) {
                console.log('All images loaded.');
                fadeOutOverlay();
              }

              var entityEl = document.querySelector('a-entity');
              entityEl.setAttribute('material', 'src', '#' + imgEl.id);
            });

            /**
             * error Event Listener
             * Listens for the error event on each image element to handle loading errors and track the loading progress.
             */
            imgEl.addEventListener('error', function() {
              console.error('Failed to load image:', imgEl.src);
              counter++;

              if (counter === totalImages) {
                console.log('All images attempted to load.');
                fadeOutOverlay();
              }
            });
          });

          console.log('All images added to <a-assets>.', assetsEl);

          const firstImageUrl = data[0].images[0].imageURL;
          const skyEl = document.querySelector('a-sky');

          if (skyEl && firstImageUrl) {
            skyEl.setAttribute('src', firstImageUrl);
            skyEl.setAttribute('class', data[0].images[0].name);
            console.log('Sky image updated successfully with:', firstImageUrl);
            setupHiddenCanvas(firstImageUrl);
          }
        }
      })
      .catch(error => {
        console.error('Failed to load image data:', error);
      });
  }

  /**
   * setupHiddenCanvas(imageUrl)
   * Sets up a hidden canvas element for processing the specified image URL.
   * @param {string} imageUrl - The URL of the image to be processed on the canvas.
   */
  function setupHiddenCanvas(imageUrl) {
    const canvas = document.getElementById('hiddenCanvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = imageUrl;

    console.log('Image URL:', image.src);
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height / 1.2;
      context.drawImage(image, 0, 0);
    };
  }

  /**
   * loadPortalData(houseId)
   * Fetches portal data for the specified house and creates window entities in the A-Frame scene.
   * Emits a loadWindows event for each portal with the corresponding data.
   * @param {string} houseId - The ID of the house to load portals for.
   */
  function loadPortalData(houseId) {
    fetch('https://azimatours.onrender.com/api/house/house/puller/' + houseId)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json(); // Parse the JSON of the response
      })
      .then(data => {
        console.log('Portals:', data[0].portals);
        const sceneEl = document.querySelector('a-scene');

        if (sceneEl && Array.isArray(data[0].portals) && data[0].portals.length > 0) {
          data[0].portals.forEach((windowData, index) => {
            console.log(windowData);
            let windowEntity = document.createElement("a-entity");
            windowEntity.setAttribute("loader", "");
            windowEntity.setAttribute("id", `window-${index}`);
            sceneEl.appendChild(windowEntity);

            if (sceneEl.contains(windowEntity)) {
              /**
               * loadWindows Event Emitter
               * Emits a loadWindows event for each portal after ensuring the entity is part of the scene.
               */
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

  /**
   * loadWIPPortalData(houseId)
   * Fetches work-in-progress (WIP) portal data for the specified house and creates window entities in the A-Frame scene.
   * Emits a loadWindows event for each WIP portal with the corresponding data.
   * @param {string} houseId - The ID of the house to load WIP portals for.
   */
  function loadWIPPortalData(houseId) {
    fetch('https://azimatours.onrender.com/api/portal/' + houseId)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json(); // Parse the JSON of the response
      })
      .then(data => {
        console.log('WIP Portal loaded:', data);
        const sceneEl = document.querySelector('a-scene');
        let loadedPortalIds = new Set();

        if (sceneEl && Array.isArray(data) && data.length > 0) {
          data.forEach((windowData, index) => {
            if (!loadedPortalIds.has(windowData._id)) {
              loadedPortalIds.add(windowData._id);
              let windowEntity = document.createElement("a-entity");
              windowEntity.setAttribute("loader", "");
              windowEntity.setAttribute("id", `wip-portal-${index}`);
              sceneEl.appendChild(windowEntity);

              /**
               * loadWindows Event Emitter
               * Emits a loadWindows event for each WIP portal after ensuring the entity is part of the scene.
               */
              setTimeout(() => {
                sceneEl.emit('loadWindows', { detail: { id: `wip-portal-${index}`, data: windowData } }, false);
                console.log("emitted loadwindows with", windowData);
              }, 100);
            } else {
              console.log("Skipping duplicate portal ID:", windowData.id);
            }
          });
        }
      })
      .catch(error => {
        console.error('Failed to load portal data:', error);
      });
  }
});