/**
 * link.js
 * Description: Manages the creation, storage, and handling of portal elements in the A-Frame scene. It handles drawing, saving, and listening to multiple events, and has an API endpoint for pushing portals created in the editor application to the backend.
 */

AFRAME.registerComponent("linker", {

  /**
   * init()
   * Initializes the linker component by setting up the element, initializing variables, and adding event listeners.
   */
  init: function () {
    console.log("[linker] Component initialized.");
    this.initializeVariables();
    this.addEventListeners();
  },

  /**
   * initializeVariables()
   * Sets up the initial variables and configurations required for the linker component.
   * Creates a new A-Frame entity (window) and appends it to the scene.
   */
  initializeVariables: function () {
    let window = document.createElement("a-entity");
    window.setAttribute("loader", "");
    this.el.sceneEl.appendChild(window);

    this.color = null;
    this.identifier = null;
    this.hoverTimeout = null;
    this.triangles = [];
    this.cursor = document.getElementById("cursorRing");
    this.handleSelection = this.handleSelection.bind(this);
    this.handleColorInput = this.handleColorInput.bind(this);

    const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
    colorOptions.forEach((option) => {
      option.addEventListener("change", this.handleColorInput);
    });

    const select = document.getElementById('scroll');
    select.addEventListener('click', (e) => {
      this.handleSelection(e);
    });

    const toggleTextCheckbox = document.getElementById("toggleText");
    if (toggleTextCheckbox) {
      toggleTextCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
          if (this.selected) {
            this.addText(this.selected.children[1].innerText);
          }
        } else {
          this.removeText();
        }
      });
    }
  },

  /**
   * addEventListeners()
   * Adds event listeners to the scene and document body. Listens for custom events like fourPointsCaptured and fourPointsRemoved to handle interactions with 3D shapes.
   * Sets up listeners for save and cancel actions to manage the component's state and data.
   */
  addEventListeners: function () {
    this.boundHandleFourPointsCaptured = this.handleFourPointsCaptured.bind(this);
    this.boundHandleFourPointsRemoved = this.handleFourPointsRemoved.bind(this);

    this.el.sceneEl.addEventListener("fourPointsCaptured", this.boundHandleFourPointsCaptured);
    this.el.sceneEl.addEventListener("fourPointsRemoved", this.boundHandleFourPointsRemoved);

    this.boundSaveFunction = () => {
      this.save();
    };
    document.body.addEventListener("save", this.boundSaveFunction);
    document.body.addEventListener("cancel", () => {
      this.cancel();
    });
  },

  /**
   * removeTriangles()
   * Removes all triangles from the component, cleaning up the DOM and resetting the triangles array.
   */
  removeTriangles: function () {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        this.el.removeChild(triangle);
      });
    }
    this.triangles = [];
  },

  /**
   * handleSelection(event)
   * Handles the user selection of images by updating the selected element and managing the display of associated text.
   * @param {Event} event - The event object from the click event.
   */
  handleSelection: function (event) {
    let img = event.target.closest(".image-container");
    this.removeText();
    this.addText(img.children[1].innerText, this.positions);
    this.selected = img;
  },

  /**
   * handleFourPointsCaptured(event)
   * Handles the fourPointsCaptured event by creating triangles based on the captured positions.
   * Ensures that at least four points are available before proceeding with triangle creation.
   * @param {Event} event - The custom event object with captured positions.
   */
  handleFourPointsCaptured: function (event) {
    this.positions = event.detail.positions;
    if (this.positions && this.positions.length >= 4) {
      this.createTriangles(this.positions, event);
    }
  },

  /**
   * handleFourPointsRemoved(event)
   * Handles the fourPointsRemoved event by removing all existing triangles from the component.
   * @param {Event} event - The custom event object.
   */
  handleFourPointsRemoved: function (event) {
    this.removeTriangles();
  },

  /**
   * remove()
   * Cleans up the linker component by removing event listeners and DOM elements.
   * Resets the component's state and ensures all resources are properly released.
   */
  remove: function () {
    this.el.sceneEl.removeEventListener("fourPointsCaptured", this.boundHandleFourPointsCaptured);
    this.el.sceneEl.removeEventListener("fourPointsRemoved", this.boundHandleFourPointsRemoved);
    document.body.removeEventListener("save", this.boundSaveFunction);

    this.triangles = [];
    this.positions = null;
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  },

  /**
   * handleColorInput(event)
   * Handles changes to color input by updating the component's color state and applying the new color to the triangles.
   * @param {Event} event - The event object from the color input change.
   */
  handleColorInput: function (event) {
    this.changeColor(event.target.value);
    this.color = event.target.value;
  },

  /**
   * save()
   * Saves the current state of the component, including 3D shapes and text data, to a remote server.
   * Constructs the necessary data and sends a POST request to the server.
   */
  save: function () {
    console.log("Save called at:", new Date().toISOString()); // Log the exact time the save is called
    const params = new URLSearchParams(window.parent.location.search);
    const houseID = params.get('houseID');
    console.log("House ID:", houseID);

    let eventData = JSON.stringify({
        destination: this.el.getAttribute("id"),
        location: this.el.getAttribute("class"),
        houseID: houseID,
        triangles: this.serializeTriangles(this.triangles),
        textData: this.serializeText(this.triangles),
    });

    console.log("Event data prepared:", eventData);

    fetch('https://azimatours.onrender.com/api/house/house/' + houseID + '/portals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: eventData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Document saved:', data);
        console.log("Processing UI changes post-save");
   
        let formContainer = document.getElementById("formContainer");
        let saveContainer = document.getElementById("saveContainer");

        console.log("Emitting createWindow now with eventData:", eventData);
        this.el.sceneEl.emit("createWindow", eventData);
        console.log("[linker] Event 'createWindow' emitted with event details:", eventData);

        let container = document.getElementById("aframe-container");
        let overlay = document.getElementById("overlay");
        let camera = this.el.sceneEl.querySelector("[camera]");

        console.log("Setting cursor thickness and FOV changes");
        this.cursor.setAttribute("toggle-thickness", "");

        let newFov = 80;
        camera.setAttribute("camera", "fov", newFov);
        this.el.sceneEl.emit('fovChanged', { fov: newFov });

        console.log("Removing color-picker event listeners");
        const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
        colorOptions.forEach((option) => {
            option.removeEventListener("change", this.handleColorInput);
        });
        if (container) {
            console.log("Adjusting container and overlay dimensions and padding");
            container.style.position = 'relative';
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.overflow = 'hidden';
            container.style.display = 'flex';
            container.style.margin = '0 0 0 0';
            container.style.padding = '0';
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
        }
        let sidebar = document.getElementById('portal-sidebar');
        if (sidebar) {
            sidebar.style.display = 'none'; // Show sidebar if it was hidden
        }
        formContainer.innerHTML = '';
        saveContainer.style.display = 'flex';
        console.log("Calling remove method to clean up");
        this.remove();
    })
    .catch(error => console.error('Error saving document:', error));
},

  /**
   * serializeTriangles(triangles)
   * Serializes the triangle elements into a structured format suitable for saving.
   * @param {Array} triangles - The array of triangle elements.
   * @returns {Array} - The serialized triangle data.
   */
  serializeTriangles: function(triangles) {
    const serializedTriangles = triangles.map(triangle => {
      const materialAttr = triangle.getAttribute('material');
      return {
        vertexA: triangle.getAttribute('vertex-a'),
        vertexB: triangle.getAttribute('vertex-b'),
        vertexC: triangle.getAttribute('vertex-c'),
        color: materialAttr ? materialAttr.color : 'blue'
      };
    });
    return serializedTriangles;
  },

  /**
   * serializeText(triangles)
   * Serializes the text elements associated with triangles.
   * @param {Array} triangles - The array of triangle elements.
   * @returns {Array} - The serialized text data.
   */
  serializeText: function(triangles) {
    const serializedTexts = triangles.map(triangle => {
      const textEl = triangle.querySelector('a-text');
      if (textEl) {
        const posX = textEl.object3D.position.x;
        const posY = textEl.object3D.position.y;
        const posZ = textEl.object3D.position.z;
        const positionStr = `${posX} ${posY} ${posZ}`;

        return {
          value: textEl.getAttribute('value'),
          position: positionStr,
          rotation: textEl.getAttribute('rotation')
        };
      }
      return null;
    }).filter(text => text !== null);

    return serializedTexts;
  },

  /**
   * cancel()
   * Handles the cancel action by resetting the component's state and UI elements.
   * Removes event listeners, restores default settings, and clears the form container.
   */
  cancel: function () {
    let container = document.getElementById("aframe-container");
    let overlay = document.getElementById("overlay");
    let sky = document.querySelector('a-sky');
    let camera = this.el.sceneEl.querySelector("[camera]");
    let formContainer = document.getElementById("formContainer");
    let saveContainer = document.getElementById("saveContainer");

    const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
    colorOptions.forEach((option) => {
      option.removeEventListener("change", this.handleColorInput);
    });

    this.cursor.setAttribute("toggle-thickness", "");
    sky.removeAttribute("markable");

    let newFov = 80;
    camera.setAttribute("camera", "fov", newFov);
    this.el.sceneEl.emit('fov Changed', { fov: newFov });
    if (container) {
      container.style.width = "100vw";
      container.style.height = "100vh";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      container.style.padding = "0px";
      container.style.margin = "0px";
    }
    
    formContainer.innerHTML = '';
    saveContainer.style.display = 'flex';
    this.remove();
  },

  /**
  
    •	changeColor(color)
    •	Changes the color of the triangles based on the provided color value.
    •	@param {string} color - The new color value.
  */
  changeColor: function (color) {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', { color: color });
        triangle.setAttribute('material', { shader: 'flat' });
      });
    }
  },
  
  /**
  
    •	addText(input)
    •	Adds text elements to the triangles based on the provided input.
    •	Positions the text appropriately and ensures it is correctly attached to the relevant triangle.
    •	@param {string} input - The text value to add.
  */
  addText: function (input) {
  if (this.triangles) {
  this.triangles.forEach((triangle, index) => {
  if (index == 3) {
  let text = document.createElement('a-text');
  let camera = this.el.sceneEl.querySelector('[camera]');
  let direction = new THREE.Vector3();
  camera.object3D.getWorldDirection(direction);
  direction.negate();
  let distance = 3;
  direction.multiplyScalar(distance);
  text.setAttribute("value", input);
  text.setAttribute("align", "center");
  text.setAttribute("font", "./assets/MazzardM-Regular-msdf.json");
  text.setAttribute("negate", "false");
 
  let rotation = camera.getAttribute("rotation").y;
  let angle = THREE.MathUtils.degToRad(rotation);
  text.setAttribute("rotation", { x: 0, y: rotation, z: 0 });
 
  let offset = 0.3;
  let midpoint = {
    x: (this.positions[0].x + this.positions[1].x + this.positions[2].x + this.positions[3].x) / 4,
    y: (this.positions[0].y + this.positions[1].y + this.positions[2].y + this.positions[3].y) / 4,
    z: (this.positions[0].z + this.positions[1].z + this.positions[2].z + this.positions[3].z) / 4,
  };
  midpoint.x += offset * Math.sin(angle);
  midpoint.z += offset * Math.cos(angle);
 
  text.setAttribute("position", `${midpoint.x} ${midpoint.y} ${midpoint.z}`);
  text.setAttribute("width", "30");
 
  this.el.setAttribute("id", input);
  triangle.appendChild(text);
  }
});
}
},

/**

	•	removeText()
	•	Removes text elements from the triangles.
*/
removeText: function () {
if (this.triangles) {
this.triangles.forEach((triangle, index) => {
if (index == 3) {
let textElement = triangle.querySelector('a-text');
if (textElement) {
triangle.removeChild(textElement);
}
}
});
}
},

/**

	•	createTriangles(positions, event)
	•	Creates A-Triangle elements based on the provided positions and event details.
	•	Sets up the vertices and color of each triangle, adding them to the component’s DOM.
	•	@param {Array} positions - The array of position vectors for the vertices.
	•	@param {Event} event - The event object with additional details.
*/
createTriangles: function (positions, event) {
let sky = document.querySelector('a-sky');
let m = document.createElement("a-triangle");
let mb = document.createElement("a-triangle");
let mt = document.createElement("a-triangle");
let mtb = document.createElement("a-triangle");

this.triangles = [m, mb, mt, mtb];
if (this.color) {
  m.setAttribute("material", `color: ${this.color}`);
  mb.setAttribute("material", `color: ${this.color}`);
  mt.setAttribute("material", `color: ${this.color}`);
  mtb.setAttribute("material", `color: ${this.color}`);
}
m.setAttribute("vertex-a", `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
m.setAttribute("vertex-b", `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`);
m.setAttribute("vertex-c", `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
mb.setAttribute("vertex-a", `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
mb.setAttribute("vertex-b", `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`);
mb.setAttribute("vertex-c", `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
mt.setAttribute("vertex-a", `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
mt.setAttribute("vertex-b", `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`);
mt.setAttribute("vertex-c", `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
mtb.setAttribute("vertex-a", `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
mtb.setAttribute("vertex-b", `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`);
mtb.setAttribute("vertex-c", `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);

this.el.setAttribute("class", sky.getAttribute("class"));
this.el.appendChild(mb);
this.el.appendChild(mt);
this.el.appendChild(mtb);
this.el.appendChild(m);
},
});