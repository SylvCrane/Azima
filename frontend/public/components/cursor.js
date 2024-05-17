AFRAME.registerComponent('toggle-thickness', {
  init: function() {
      this.isThick = false;
      this.isFocused = false;
      this.plus = document.createElement('button');
      this.plus.className = "plus-button";
      this.plus.innerText = "+";
      this.removecounter = 1;
      this.addcounter = 1;

      this.portalManager = document.createElement('a-entity');
      this.portalManager.setAttribute('portal-manager', '');
      this.el.appendChild(this.portalManager);

      this.addPortal = this.createPortal('Add Portal', '#4ABFAA');
      this.removePortal = this.createPortal('Remove Portal', '#4ABFAA');

      this.cursor = document.getElementById('cursorRing');

      this.boundHandlePlusClick = this.handlePlusClick.bind(this);
      this.boundHandleCursorClick = this.handleCursorClick.bind(this);
      this.plus.addEventListener('click', this.boundHandlePlusClick);
      this.cursor.addEventListener('click', this.boundHandleCursorClick);

      this.addPortal.addEventListener('click', this.boundHandleaddPortalClick);
      this.cursor.addEventListener('raycaster-intersection', this.handleHover.bind(this));
      this.cursor.addEventListener('raycaster-intersection-cleared', this.handleHoverEnd.bind(this));
      this.addListeners();

      // Create instructional text element
    this.instructionText = document.createElement('div');
    this.instructionText.innerText = 'Click the circle, then the plus, and move the circle to add or remove a portal.';
    this.instructionText.style.position = 'fixed';
    this.instructionText.style.top = '65%';
    this.instructionText.style.left = '50%';
    this.instructionText.style.transform = 'translateX(-50%)';
    this.instructionText.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this.instructionText.style.color = '#fff';
    this.instructionText.style.padding = '10px 20px';
    this.instructionText.style.borderRadius = '5px';
    this.instructionText.style.zIndex = '1000';
    this.instructionText.style.fontFamily = 'Rubik, sans-serif';
    this.instructionText.style.fontSize = '16px';
    this.instructionText.style.textAlign = 'center';

    // Append the instructional text to the body if on the A-Frame page
   document.body.appendChild(this.instructionText);
  
  },
  addListeners: function() {
      this.boundHandleaddPortalClick = this.handleaddPortalClick.bind(this);
      this.boundHandleRemovePortalClick = this.handleRemovePortalClick.bind(this);

      this.removePortal.addEventListener('click', this.boundHandleRemovePortalClick);
      this.addPortal.addEventListener('click', this.boundHandleAddPortalClick);

      this.cursor.addEventListener('raycaster-intersection', this.handleHover.bind(this));
      this.cursor.addEventListener('raycaster-intersection-cleared', this.handleHoverEnd.bind(this));
  },
  createPortal: function(text, color) {
      let portal = document.createElement('a-entity');
      portal.setAttribute('geometry', 'primitive: circle; radius:0.25');
      portal.setAttribute('material', {
          color: color,
          opacity: 0.8
      });
      portal.setAttribute('text', {
          value: text,
          align: 'center',
          width: 3,
          font: './assets/MazzardM-Bold-msdf.json',
          negate: 'false'
      });

      return portal;
  },
  handleaddPortalClick: function(e) {
      this.addcounter *= -1;
      if (this.addcounter === -1) {
          this.addPortal.removeEventListener('click', this.boundHandleAddPortalClick);
          this.removePortal.removeEventListener('click', this.boundHandleRemovePortalClick);
          this.plus.removeEventListener('click', this.handlePlusClick.bind(this));
          this.cursor.removeEventListener('click', this.handleCursorClick.bind(this));
          console.log("click button");
          this.addRoom();
      }
      // Removes instruction text when add portal is clickec
      if (this.instructionText) {
        document.body.removeChild(this.instructionText);
        this.instructionText = null;
      }

      // Add class to scroll container
      let scrollContainer = document.getElementById('scroll');
      if (scrollContainer) {
          scrollContainer.classList.add('column-layout');
      }
  },
  toggleSidebar: function() {
      var sidebar = document.getElementById('portal-sidebar');
      var style = window.getComputedStyle(sidebar);

      if (style.transform === 'none' || style.transform === 'translateX(0px)') {
          sidebar.style.transform = 'translateX(300px)';
      } else {
          sidebar.style.transform = 'translateX(0px)';
      }
  },
  handleRemovePortalClick: function() {
      this.removecounter *= -1;
      if (this.removecounter === -1) {
          this.removePortal.removeEventListener('click', this.boundHandleRemovePortalClick);
          this.addPortal.removeEventListener('click', this.handleaddPortalClick.bind(this));
          this.portalManager.emit('portal-update');

          if (this.el.sceneEl.contains(this.addPortal && this.removePortal)) {
              this.el.sceneEl.remove(this.removePortal);
              this.el.sceneEl.remove(this.addPortal);
          }
          this.toggleSidebar();
          if (!this.isFocused) {
              this.plus.addEventListener('click', this.boundHandlePlusClick);
          }
      }

      // Removes instruction text when remove portal is clicked.
      if (this.instructionText) {
        document.body.removeChild(this.instructionText);
        this.instructionText = null;
    }
  },
  handleHover: function(evt) {
      if (evt.detail.els.includes(this.addPortal)) {
          this.cursor.setAttribute('material', 'opacity: 0.5');
      }
  },
  handleHoverEnd: function(evt) {
      if (!evt.detail.els) {
          this.cursor.setAttribute('material', 'opacity:1');
      }
  },
  handlePlusClick: function() {
      this.addPortal = this.createPortal('Add Portal', '#4ABFAA');
      this.removePortal = this.createPortal('Remove Portal', '#4ABFAA');
      this.addListeners();
      this.addPortal.addEventListener('click', this.boundHandleaddPortalClick);
      this.plus.remove();
      console.log("click");
      let camera = this.el.sceneEl.querySelector('[camera]');
      let direction = new THREE.Vector3();
      camera.object3D.getWorldDirection(direction);
      direction.negate();
      let distance = 3;
      direction.multiplyScalar(distance);

      let camPos = camera.getAttribute('position');
      let camRot = camera.getAttribute('rotation').y;

      function calculateButtonPosition(offsetAngle) {
          let angle = THREE.MathUtils.degToRad(camRot + offsetAngle);
          const offset = 0.5;
          const offsetX = Math.sin(angle) * offset;
          const offsetZ = Math.cos(angle) * offset;

          return {
              x: camPos.x + direction.x + offsetX,
              y: camPos.y + direction.y,
              z: camPos.z + direction.z + offsetZ
          };
      }

      let buttonPos1 = calculateButtonPosition(50); // Offset by 30 degrees
      let buttonPos2 = calculateButtonPosition(-50); // Offset by -30 degrees

      this.addPortal.setAttribute('position', `${buttonPos1.x} ${buttonPos1.y} ${buttonPos1.z}`);
      this.removePortal.setAttribute('position', `${buttonPos2.x} ${buttonPos2.y} ${buttonPos2.z}`);
      this.addPortal.setAttribute('rotation', { x: 0, y: camRot, z: 0 });
      this.removePortal.setAttribute('rotation', { x: 0, y: camRot, z: 0 });
      this.el.sceneEl.appendChild(this.removePortal);
      this.el.sceneEl.appendChild(this.addPortal);
      this.el.setAttribute('geometry', {
          radiusOuter: 0.03
      });
  },
  handleCursorClick: function() {
      let currentRadiusOuter = this.el.getAttribute('geometry').radiusOuter;
      let newRadiusOuter
      if (this.isThick) {
          newRadiusOuter = 0.03;
          this.el.sceneEl.remove(this.removePortal);
          this.el.sceneEl.remove(this.addPortal);
          this.plus.remove();
      } else {
          document.body.appendChild(this.plus);
          newRadiusOuter = currentRadiusOuter + 0.01;
      }
      this.el.setAttribute('geometry', {
          radiusOuter: newRadiusOuter
      });

      this.isThick = !this.isThick;
  },
  addRoom: function() {
      console.log()
      let sky = document.querySelector('a-sky');
      if (this.el.sceneEl.contains(this.addPortal && this.removePortal)) {
          this.el.sceneEl.remove(this.removePortal);
          this.el.sceneEl.remove(this.addPortal);
      }
      this.plus.remove();
      let link = document.createElement('a-entity');
      link.setAttribute('linker', '');

      console.log("linker made:");
      this.el.sceneEl.appendChild(link);

      let container = document.getElementById('aframe-container');
      let overlay = document.getElementById('overlay');
      var sceneEl = document.querySelector('a-scene');
      if (sceneEl) {
          sceneEl.setAttribute('vr-mode-ui', 'enabled', false);
      }
      if (container) {
        this.isFocused = true;
    
        // Apply the new styles to the container
        container.style.position = 'relative';
        container.style.width = '120vh'; // Adjust the width to account for the left margin
        container.style.height = '70vh'; // Adjust the height as needed
        container.style.overflow = 'hidden';
        container.style.display = 'flex';
        container.style.margin = '0';
        container.style.padding = '0';
        container.style.marginTop = '50px'; // Add left margin to push the container to the right
        container.style.marginLeft = '220px'; // Add left margin to push the container to the right
    
        overlay.style.width = "120vh";
        overlay.style.height = "70vh";

          let camera = this.el.sceneEl.querySelector('[camera]');
          camera.setAttribute('camera', 'fov', '20');

          this.cursor.removeEventListener('click', this.boundHandleCursorClick);
          console.log("tick");

          console.log('Adding markable component to sky');
          sky.setAttribute('markable', '');
          console.log('Markable component added to sky');

          this.createAndInsertForms();

          console.log("scaling");
          this.cursor.setAttribute('geometry', {
              radiusOuter: 0.006,
              radiusInner: 0.004
          });
          this.el.removeAttribute('toggle-thickness');

          return;
      }
  },
  createAndInsertForms: function() {
     
    let saveContainer = document.getElementById('saveContainer');
    saveContainer.style.display = 'none';
     let sidebar = document.getElementById('portal-sidebar');
     sidebar.style.display = 'none'
     let formContainer = document.getElementById('formContainer'); // Ensure you have this container in your HTML
     if (!formContainer) {
         console.error('Form container not found');
         return;
     }
     formContainer.innerHTML = ''; // Clear existing content
 
     // Dynamically create the input form elements
     let viewNameForm = document.createElement('div');
     viewNameForm.innerHTML = `
     <div class="color-picker" id="color-picker">
        <h1>Select a color:</h1>
        <label class="color-option">
            <input type="radio" name="color" value="#FFffff">
            <span class="color-display" style="background-color: #Ffffff;"></span>
        </label>
        <label class="color-option">
            <input type="radio" name="color" value="#9FD3CB">
            <span class="color-display" style="background-color: #9FD3CB;"></span>
        </label>
        <label class="color-option">
            <input type="radio" name="color" value="#4ABFAA">
            <span class="color-display" style="background-color: #4ABFAA;"></span>
        </label>
        <label class="color-option">
            <input type="radio" name="color" value="#0EB49A">
            <span class="color-display" style="background-color: #0EB49A;"></span>
        </label>
        <label class="color-option">
            <input type="radio" name="color" value="#0A7A68">
            <span class="color-display" style="background-color: #0A7A68"></span>
        </label>
        <label class="color-option">
            <input type="radio" name="color" value="#09483E">
            <span class="color-display" style="background-color: #09483E;"></span>
        </label>
      </div>
  
      <div class="zoom-controls">
      <button id="zoomInBtn" style="border: none; background: none;">
       <img src="./assets/magnifying-glass-plus-solid.svg" alt="Close" style="width: 30px; height: 30px;">
    
    </button>
   <button id="zoomOutBtn" style="border: none; background: none;">
   <img src="./assets/magnifying-glass-minus-solid.svg" alt="Close" style="width: 30px; height: 30px;">
   
 </button>
 </div>
 
   <div class="select-gallery" id="select-gallery">
       <div class="scroll-container" id="scroll">
      
       </div>
      
       
       </div>
     </div>
   </div>
   <div class="toggle-text-container">
   <label><input type="checkbox" id="toggleText" checked>Show text</label>
 </div>
 <div>
 <button id="saveButton">Save</button><br/>
 <button id="cancelButton">Cancel</button>
</div>
   <div class="instruction">
      To create a portal, select the four points of the door/area you want as your entry point. <br/>
      Then select the room on the side where you want the portal to link to.
    </div>
     `;
 
     // Append the form to the container
     formContainer.appendChild(viewNameForm);
     document.dispatchEvent(new Event("edit"));
     console.log("edit sent");



   // Add event listener for the save button
   document.getElementById('saveButton').addEventListener('click', function() {
    // Implement save functionality here
    // For example, save form data, update state, etc.

    let container = document.getElementById('aframe-container');
    let overlay = document.getElementById('overlay');

    // Reset container styles
    container.style.position = 'relative';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.margin = '0';
    container.style.padding = '0';

    // Reset overlay styles
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';

    // Optionally hide or reset any other elements
    let formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // Clear the form container

    // Reset the camera field of view if it was changed
    let camera = document.querySelector('[camera]');
    camera.setAttribute('camera', 'fov', '80'); // Reset FOV to default or desired value

    // Additional reset actions if needed
    // Remove event listeners or reset other states

    // Hide or reset any other custom elements
    let sidebar = document.getElementById('portal-sidebar');
    if (sidebar) {
        sidebar.style.display = 'block'; // Show sidebar if it was hidden
    }

    let saveContainer = document.getElementById('saveContainer');
    if (saveContainer) {
        saveContainer.style.display = 'block'; // Show save container if it was hidden
    }
});

 },
});