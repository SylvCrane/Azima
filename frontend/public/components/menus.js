/**
 * menus.js
 * Description: Manages the UI elements and interactions for adding and removing portals, and provides instructional text for the Azima platform.
 */

AFRAME.registerComponent('toggle-thickness', {
  init: function() {
    this.isThick = false;
    this.isFocused = false;
    this.plus = document.createElement('button');
    this.plus.className = "plus-button";
    this.plus.innerText = "+";
    this.removecounter = 1;
    this.addcounter = 1;
    this.defaultColor = 'white';
    this.highlightColor = 'yellow';

    this.instructionText = document.createElement('div');
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

    this.addListeners();

    this.createInstructionalText();
    this.resetInactivityTimeout(5000);
  },

  /**
   * createInstructionalText()
   * Creates and styles the instructional text element.
   */
  createInstructionalText: function() {
    this.instructionText.innerText = 'Click and drag on the screen to look around.';
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
    this.instructionText.style.display = 'none'; // Initially hide the instructional text

    document.body.appendChild(this.instructionText);
  },

  /**
   * showInstructionText()
   * Displays the instructional text element.
   */
  showInstructionText: function() {
    if (this.instructionText) {
      this.instructionText.style.display = 'block';
    }
  },

  /**
   * hideInstructionText()
   * Hides the instructional text element.
   */
  hideInstructionText: function() {
    if (this.instructionText) {
      this.instructionText.style.display = 'none';
    }
  },

  /**
   * resetInactivityTimeout(timeOut)
   * Resets the inactivity timeout to show the instructional text after a specified time period.
   * @param {number} timeOut - The timeout period in milliseconds.
   */
  resetInactivityTimeout: function(timeOut) {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.showInstructionText('Click and drag on the screen to look around.');
    }, timeOut);
  },

  /**
   * addListeners()
   * Adds event listeners for portal interaction and hover effects.
   */
  addListeners: function() {
    console.log("Adding listeners");

    this.boundHandleaddPortalClick = this.handleaddPortalClick.bind(this);
    this.boundHandleRemovePortalClick = this.handleRemovePortalClick.bind(this);

    this.removePortal.addEventListener('click', this.boundHandleRemovePortalClick);
    this.addPortal.addEventListener('click', this.boundHandleaddPortalClick);

    /**
     * raycaster-intersection Event Listener
     * Listens for intersection events from the raycaster to handle hover effects.
     */
    this.el.addEventListener('raycaster-intersection', this.handleHover.bind(this));

    /**
     * raycaster-intersection-cleared Event Listener
     * Listens for cleared intersection events from the raycaster to reset hover effects.
     */
    this.el.addEventListener('raycaster-intersection-cleared', this.handleHoverEnd.bind(this));
  },

  /**
   * createPortal(text, color)
   * Creates a option element with the specified text and color.
   * @param {string} text - The text to display on the portal.
   * @param {string} color - The color of the portal.
   * @returns {HTMLElement} - The created portal element.
   */
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

  /**
   * handleaddPortalClick(e)
   * Handles the click event for adding a portal.
   * @param {Event} e - The event object from the click event.
   */
  handleaddPortalClick: function(e) {
    this.addcounter *= -1;
    if (this.addcounter === -1) {
      this.addPortal.removeEventListener('click', this.boundHandleaddPortalClick);
      this.removePortal.removeEventListener('click', this.boundHandleRemovePortalClick);
      this.plus.removeEventListener('click', this.handlePlusClick.bind(this));
      this.cursor.removeEventListener('click', this.handleCursorClick.bind(this));
      console.log("click button");
      this.addRoom();
    }

    if (this.instructionText) {
      document.body.removeChild(this.instructionText);
      this.instructionText = null;
    }

    let scrollContainer = document.getElementById('scroll');
    if (scrollContainer) {
      scrollContainer.classList.add('column-layout');
    }
  },

  /**
   * toggleSidebar()
   * Toggles the visibility of the portal sidebar.
   */
  toggleSidebar: function() {
    var sidebar = document.getElementById('portal-sidebar');
    var style = window.getComputedStyle(sidebar);

    if (style.transform === 'none' || style.transform === 'translateX(0px)') {
      sidebar.style.transform = 'translateX(300px)';
    } else {
      sidebar.style.transform = 'translateX(0px)';
    }
  },

  /**
   * handleRemovePortalClick()
   * Handles the click event for removing a portal.
   */
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

    if (this.instructionText) {
      document.body.removeChild(this.instructionText);
      this.instructionText = null;
    }
  },

  /**
   * handleHover(evt)
   * Handles the hover event by updating the cursor and portal colors based on intersection.
   * @param {Event} evt - The event object from the raycaster intersection.
   */
  handleHover: function(evt) {
    this.canvas = document.getElementById('hiddenCanvas');
    const intersection = evt.detail.els[0];
    if (intersection) {
      const uv = intersection.uv;
      const imageX = Math.floor(uv.x * this.canvas.width);
      const imageY = Math.floor(uv.y * this.canvas.height);
      const color = this.getPixelColor(imageX, imageY);
      console.log(`Cursor is hovering over color: ${color}`);
      this.el.setAttribute('material', 'color', color === 'rgb(255, 255, 255)' ? this.highlightColor : this.defaultColor);
    }
    if (evt.detail.els.includes(this.addPortal)) {
      this.cursor.setAttribute('material', 'opacity: 0.5');
    }
  },

  /**
   * handleHoverEnd(evt)
   * Handles the end of the hover event by resetting the cursor and portal colors.
   * @param {Event} evt - The event object from the raycaster intersection cleared.
   */
  handleHoverEnd: function(evt) {
    if (!evt.detail.els) {
      this.el.setAttribute('material', 'color', this.defaultColor);
      this.cursor.setAttribute('material', 'opacity:1');
    }
  },

  /**
   * handlePlusClick()
   * Handles the click event for the plus button to open the portal manager.
   */
  handlePlusClick: function() {
    this.resetInactivityTimeout(0);
    this.instructionText.innerText = 'Drag the cursor to the option you want, then Click to select.';
    this.showInstructionText();
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

let buttonPos1 = calculateButtonPosition(50);
let buttonPos2 = calculateButtonPosition(-50);

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

/**

	•	handleCursorClick()
	•	Handles the click event on the cursor to toggle its thickness and manage instructional text visibility.
*/
handleCursorClick: function() {
this.resetInactivityTimeout(0);
this.instructionText.innerText = 'Click the plus to open the portal manager.';
this.showInstructionText();
let currentRadiusOuter = this.el.getAttribute('geometry').radiusOuter;
let newRadiusOuter;
if (this.isThick) {
  newRadiusOuter = 0.03;
  this.el.sceneEl.remove(this.removePortal);
  this.el.sceneEl.remove(this.addPortal);
  this.plus.remove();
  this.resetInactivityTimeout(5000);
  this.instructionText.innerText = 'Click and drag on the screen to look around.';

  setTimeout(() => {
    this.hideInstructionText();
    this.resetInactivityTimeout(5000);
  }, 0);
} else {
  document.body.appendChild(this.plus);
  newRadiusOuter = currentRadiusOuter + 0.01;
}
this.el.setAttribute('geometry', {
  radiusOuter: newRadiusOuter
});

this.isThick = !this.isThick;
},

/**

	•	addRoom()
	•	Adds a new room by creating and appending a link entity, and adjusting the UI container and camera settings.
*/
addRoom: function() {
let sky = document.querySelector('a-sky');
if (this.el.sceneEl.contains(this.addPortal && this.removePortal)) {
this.el.sceneEl.remove(this.removePortal);
this.el.sceneEl.remove(this.addPortal);
}
this.plus.remove();
let link = document.createElement('a-entity');
link.setAttribute('linker', '');
this.el.sceneEl.appendChild(link);

let container = document.getElementById('aframe-container');
let overlay = document.getElementById('overlay');
var sceneEl = document.querySelector('a-scene');
if (sceneEl) {
  sceneEl.setAttribute('vr-mode-ui', 'enabled', false);
}
if (container) {
  this.isFocused = true;

  container.style.position = 'relative';
  container.style.width = '120vh';
  container.style.height = '70vh';
  container.style.overflow = 'hidden';
  container.style.display = 'flex';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.marginTop = '50px';
  container.style.marginLeft = '220px';

  overlay.style.width = "120vh";
  overlay.style.height = "70vh";

  let camera = this.el.sceneEl.querySelector('[camera]');
  camera.setAttribute('camera', 'fov', '20');

  this.cursor.removeEventListener('click', this.boundHandleCursorClick);

  sky.setAttribute('markable', '');

  this.createAndInsertForms();

  this.cursor.setAttribute('geometry', {
    radiusOuter: 0.006,
    radiusInner: 0.004
  });
  this.el.removeAttribute('toggle-thickness');

  return;
}},

/**

	•	createAndInsertForms()
	•	Creates and inserts the input form elements for portal customization.
*/
createAndInsertForms: function() {
let saveContainer = document.getElementById('saveContainer');
saveContainer.style.display = 'none';
let sidebar = document.getElementById('portal-sidebar');
sidebar.style.display = 'none';
let formContainer = document.getElementById('formContainer');
if (!formContainer) {
console.error('Form container not found');
return;
}
formContainer.innerHTML = '';
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
    <div class="scroll-container" id="scroll"></div>
  </div>
`;

formContainer.appendChild(viewNameForm);
document.dispatchEvent(new Event("edit"));
console.log("edit sent");
},
});