/**
 * capture.js
 * Description: Handles the creation and functionality of the "remove portal" sidebar that appears when a user selects the option to remove a portal from the A-Scene.
 */

// Register the A-Frame component 'portal-manager'
AFRAME.registerComponent('portal-manager', {
    /**
     * init()
     * Initializes the portal-manager component.
     * Sets up the renderer with anti-aliasing enabled and a perspective camera specifically designed for capturing square images.
     * Initializes a WebGL render target and sets up a counter for managing portal captures.
     * Also checks for the presence of a sidebar container element logging an error if it’s not found.
     * Binds several component methods to ensure proper context when they are called and adds event listeners to handle portal updates and reloads.
     * Additionally, sets up a click event listener for interacting with the portal list.
     */
    init: function() {
        console.log('portal-manager initialized');

        // Initialize the renderer and camera for capturing portal images
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.captureCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio 1 for square images
        this.renderTarget = new THREE.WebGLRenderTarget(256, 256);
        this.counter = 1;
        // Container for sidebar
        this.sidebar = document.getElementById('portal-sidebar');
        if (!this.sidebar) {
            console.error('Sidebar container not found');
            return;
        }
        console.log('Sidebar container initialized');

        // Bind functions
        this.selectPortal = this.selectPortal.bind(this);
        this.handleListClick = this.handleListClick.bind(this);
        this.updatePortals = this.updatePortals.bind(this);
        this.capturePortal = this.capturePortal.bind(this);

        // Listen for scene updates or other triggers to refresh portal list
        this.el.sceneEl.addEventListener('portal-update', this.updatePortals);
        console.log('Event listener for portal-update added');
        const list = document.getElementById('portal-list');
        list.addEventListener('click', this.handleListClick);
        
        this.el.sceneEl.addEventListener('reloadScene', (event) => {
            console.log("reloadScene event received", event.detail.detail.portalEntity);
            let portalEntity = event.detail.detail.portalEntity;
            const portals = this.el.sceneEl.querySelectorAll('[window]');
            portals.forEach((portal) => {
                if (portal.class === portalEntity.class&& portal.id === portalEntity.id) {
                    console.log("Portal found and will be removed:", portal);

                    if (portal && portal.parentNode) {  // Ensure the entity and its parent exist
                        portal.parentNode.removeChild(portal);  // Use the proper DOM method to remove
                        console.log("Portal entity removed:", portal);
                    } else {
                        console.error("Portal entity or parent not found", portal);
                    }
                }
            });
        });
    },

    /**
     * selectPortal(portalEntity)
     * Handles the selection of a portal entity. When a portal is selected it logs the selection and prompts the user with a confirmation dialog to delete the portal.
     * If the user confirms a custom event removePortal is dispatched with the portal entity details and the selected portal is highlighted.
     * If the user cancels the deletion a log message indicates the cancellation.
     */
    selectPortal: function(portalEntity) {
        if (portalEntity) {
          console.log('Portal selected:', portalEntity);
          
          // Show a confirmation dialog before emitting the event
          if (window.confirm("Are you sure you want to delete this portal?")) {
            const event = new CustomEvent('removePortal', { detail: portalEntity });
            document.dispatchEvent(event);
            console.log('remove portalsent with detail ', portalEntity);
            this.highlightPortal(portalEntity); // For example, to highlight it
          } else {
            console.log('Portal deletion cancelled.');
          }
        }
    },

    /**
     * handleListClick(event)
     * Manages click events on the portal list.
     * Identifies the clicked list item and if the item contains portal data calls the selectPortal function with the relevant portal entity.
     * This enables users to interact with and select portals from the list.
     */
    handleListClick: function(event) {
        const target = event.target.closest('li');
        if (target && target.portalData) {
           this.selectPortal(target.portalData);
        }
    },

    /**
     * capturePortal(portalEntity)
     * Responsible for capturing an image of a specified portal entity.
     * Positions a directional light source and temporarily hides all other entities in the scene to ensure the portal is captured cleanly.
     * Calculates the bounding box of the portal’s content and positions the camera to capture the entire portal.
     * Renders the scene from the camera’s perspective retrieves the image data as a base64-encoded string and restores the visibility of all entities.
     * The captured image data is returned for further use.
     */
    capturePortal: function(portalEntity) {
        console.log('Portal position:', portalEntity.object3D.position);
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1); // Adjust light position as needed
        this.el.sceneEl.object3D.add(light);
        // Array to hold the triangles and text object for capturing
        let objectsToCapture = portalEntity.querySelectorAll('a-triangle, a-text');
    
        // Hide all other elements in the scene for capturing only the portal
        const sky = document.querySelector('a-sky');
        const allEntities = Array.from(this.el.sceneEl.querySelectorAll('a-entity'))
        .filter(entity => !portalEntity.contains(entity));
        console.log('Hiding entities for capture');
        allEntities.forEach(entity => entity.object3D.visible = false);
        sky.setAttribute('visible','false');
        // Show only the relevant portal triangles and text for the capture
        objectsToCapture.forEach(obj => obj.object3D.visible = true);

        // Calculate the bounding box of the portal's content
        let box = new THREE.Box3();
        objectsToCapture.forEach(obj => {
            let mesh = obj.getObject3D('mesh');
            if (mesh) {
                mesh.geometry.computeBoundingBox();
                box = box.union(mesh.geometry.boundingBox.applyMatrix4(mesh.matrixWorld));
            }
        });
    
        // Get the center and size of the bounding box
        let center = box.getCenter(new THREE.Vector3());
        let size = box.getSize(new THREE.Vector3());
        let maxDimension = Math.max(size.x, size.y, size.z);
    
        // Calculate the normal of the portal's surface based on the portal's world orientation
        let normal = new THREE.Vector3(0, 0, 1);
        normal.applyQuaternion(portalEntity.object3D.getWorldQuaternion(new THREE.Quaternion()));
        normal.normalize();
    
        // Position the camera along the normal, at a distance based on the size of the bounding box
        let cameraDistance = maxDimension * 1.05; // Distance should be enough to capture the entire portal
        let cameraPosition = normal.multiplyScalar(cameraDistance).add(center);
    
        this.captureCamera.position.copy(cameraPosition);
        this.captureCamera.lookAt(center);
        this.captureCamera.updateProjectionMatrix();
    
        // Render the scene from the perspective of the captureCamera
        console.log('Capturing portal');

        this.renderer.setSize(256, 256); // Set the desired size
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.render(this.el.sceneEl.object3D, this.captureCamera);
        let imgData = this.renderer.domElement.toDataURL();
        this.el.sceneEl.object3D.remove(light);
        // Restore visibility of all entities
        console.log('Restoring entity visibility');
        allEntities.forEach(entity => entity.object3D.visible = true);
        sky.setAttribute('visible','true');
        
        console.log('Captured image data:', imgData);
        return imgData;
    },

    /**
     * updatePortals()
     * Updates the list of portals displayed in the sidebar.
     * Clears the existing list content and iterates over all portal entities in the scene.
     * For each portal it captures an image using the capturePortal function and creates a list item with the portal image and details.
     * The list item includes mouse event listeners to highlight the portal on hover.
     * Finally, it ensures the sidebar is visible.
     */
    updatePortals: function() {
        console.log('Updating portals...');
        const sky = document.querySelector('a-sky');
        const list = document.getElementById("portal-list");
        list.innerHTML=''; // Clear existing content
        const portals = this.el.sceneEl.querySelectorAll('[window]');
        portals.forEach((portal, index) => {
            if(portal.className === sky.className){
                const imgSrc = this.capturePortal(portal);
                const listItem = document.createElement('li');
                listItem.portalData = portal; // Store portal data directly on the element for easy access
                const img = document.createElement('img');
                img.src = imgSrc;
                img.style.width = '100px';
                img.style.height = '100px';
                img.alt = `Portal ${index + 1}`;

                img.addEventListener('mouseenter', () => this.highlightPortal(portal));
                img.addEventListener('mouseleave', () => this.restorePortal(portal));
                const textContainer = document.createElement('div');
                textContainer.style.display = 'flex';
                textContainer.style.flexDirection = 'column';
                textContainer.style.justifyContent = 'center';
                textContainer.style.marginLeft = '10px';
    
                const portalText = document.createElement('span');
                const detailText = document.createElement('span');
                portalText.textContent = `Portal ${index + 1}:`;
                detailText.textContent = `Links ${portal.className} and ${portal.id}`;
                portalText.style.color = portal.querySelector('a-triangle').getAttribute('material').color;
                detailText.style.color = '#2b2b2b';
    
                textContainer.appendChild(portalText);
                textContainer.appendChild(detailText);
                listItem.appendChild(img);
                listItem.appendChild(textContainer);
                list.appendChild(listItem);
            }
        });
        // Show the sidebar if it was initially hidden
        this.sidebar.style.display = 'block';
    },
    
    /**
     * highlightPortal(portal)
     * Highlights a specified portal by changing its material properties.
     * Iterates over all a-triangle elements within the portal and sets their color to a highlight color.
     * Also adjusts the emissive properties to enhance the highlight effect.
     */
    highlightPortal: function(portal) {
        // Change material or other properties to highlight the portal
        portal.querySelectorAll('a-triangle').forEach((triangle) => {
            const material = triangle.getAttribute('material');
            triangle.setAttribute('data-original-color', material.color); // Store the original color
            triangle.setAttribute('material', 'color', '#BA3C3C'); // Set to highlight color
            triangle.setAttribute('material', 'emissive', '#BA3C3C');
            triangle.setAttribute('material', 'emissiveIntensity', '0.5');
        });
    },
    
    /**
     * restorePortal(portal)
     * Restores the original appearance of a specified portal by reverting its material properties.
     * Iterates over all a-triangle elements within the portal and restores their original color and emissive properties.
     */
    restorePortal: function(portal) {
        // Restore the original properties of the portal
        portal.querySelectorAll('a-triangle').forEach((triangle) => {
            const originalColor = triangle.getAttribute('data-original-color');
            triangle.setAttribute('material', 'color', originalColor); // Restore original color
            triangle.setAttribute('material', 'emissive', 'black');
            triangle.setAttribute('material', 'emissiveIntensity', '0');
        });
    },
    
    /**
     * remove()
     * Cleans up the portal-manager component when it is removed from the entity.
     * Removes event listeners for portal updates and releases resources used by the renderer and render target.
     */
    remove: function() {
        console.log('Removing portal-manager component');
        this.el.sceneEl.removeEventListener('portal-update', this.updatePortals);
        this.renderer.dispose();
        this.renderTarget.dispose();
        console.log('Renderer and render target disposed');
    }
});