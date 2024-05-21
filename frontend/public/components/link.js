

AFRAME.registerComponent("linker", {


  init: function () {

    console.log("[linker] Component initialized.");
    console.log(this.el);
    this.initializeVariables();
    this.addEventListeners();
  },

  initializeVariables: function () {
    let window = document.createElement("a-entity");
    window.setAttribute("loader", "");
    this.el.sceneEl.appendChild(window);
    this.color;

    this.identifier = null;
    this.hoverTimeout = null;
    this.triangles = [];
    this.cursor = document.getElementById("cursorRing");
    this.handleSelection = this.handleSelection.bind(this);
    this.handleColorInput = this.handleColorInput.bind(this);
    const colorOptions = document.querySelectorAll(
      '.color-picker input[type="radio"]'
    );
    colorOptions.forEach((option) => {
      option.addEventListener("change", this.handleColorInput);
    });

    this.selected;
    const select = document.getElementById('scroll')

    select.addEventListener('click', (e) => {
      this.handleSelection(e);
    });
    const toggleTextCheckbox = document.getElementById("toggleText");
    if (toggleTextCheckbox) {
      toggleTextCheckbox.addEventListener('change', (event) => {

        if (event.target.checked) {
          // If the checkbox is checked, re-add the text based on the current selection
          if (this.selected) {
            this.addText(this.selected.children[1].innerText);
          }
        } else {
          // If the checkbox is unchecked, remove the text
          this.removeText();
        }
      });
    }
  
    
  },

  addEventListeners: function () {
    this.boundHandleFourPointsCaptured =
      this.handleFourPointsCaptured.bind(this);
    this.boundHandleFourPointsRemoved = this.handleFourPointsRemoved.bind(this);
    

    
    // Add event listeners
    this.el.sceneEl.addEventListener(
      "fourPointsCaptured",
      this.boundHandleFourPointsCaptured
    );
    this.el.sceneEl.addEventListener(
      "fourPointsRemoved",
      this.boundHandleFourPointsRemoved
    );

    this.boundSaveFunction = () => {
      this.save();
  };
  document.body.addEventListener("save", this.boundSaveFunction);
    document.body.addEventListener("cancel", () => {
      this.cancel();
    });
  },
 

  removeTriangles: function () {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        this.el.removeChild(triangle);
      });
    }
    this.triangles = [];
  },
  handleSelection: function (event){
    let img = event.target.closest(".image-container");
   
    
    this.removeText();
  this.addText(img.children[1].innerText,this.positions);
        this.selected = img
  },

  handleFourPointsCaptured: function (event) {
    console.log(
      "[linker] 'fourPointsCaptured' event received with detail:",
      event.detail
    );
    this.positions = event.detail.positions;
    if (this.positions && this.positions.length >= 4) {
      this.createTriangles(this.positions, event);
    }
  },

  handleFourPointsRemoved: function (event) {
    console.log(
      "[linker] 'fourPointsRemoved' event received with detail:",
      event.detail
    );
    this.removeTriangles();
  },

  remove: function () {
    console.log('Remove called')
   
    this.el.sceneEl.removeEventListener(
      "fourPointsCaptured",
      this.boundHandleFourPointsCaptured
    );

    this.el.sceneEl.removeEventListener(
      "fourPointsRemoved",
      this.boundHandleFourPointsRemoved
    );
    document.body.removeEventListener("save", this.boundSaveFunction);
 
    this.triangles = [];
    this.positions = null;
    console.log(this.el, this.el.parentNode);
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      console.log('linker removed');
  } else {
      console.log('Element or parent of the element is not found')}
  },
    


 

  handleColorInput: function (event) {
    this.changeColor(event.target.value);
    this.color = event.target.value;
  },

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

  serializeTriangles: function(triangles) {
    console.log("Serializing triangles:", triangles);
    const serializedTriangles = triangles.map(triangle => {
        const materialAttr = triangle.getAttribute('material');
        const serializedTriangle = {
            vertexA: triangle.getAttribute('vertex-a'),
            vertexB: triangle.getAttribute('vertex-b'),
            vertexC: triangle.getAttribute('vertex-c'),
            color: materialAttr ? materialAttr.color : 'blue' // Use a default color or handle this case as needed
        };
        console.log("Serialized triangle:", serializedTriangle);
        return serializedTriangle;
    });
    console.log("All triangles serialized:", serializedTriangles);
    return serializedTriangles;
},

serializeText: function(triangles) {
  console.log("Serializing text from triangles:", triangles);
  const serializedTexts = triangles.map(triangle => {
      const textEl = triangle.querySelector('a-text');
      if (textEl) {
          // Retrieve individual position components
          const posX = textEl.object3D.position.x;
          const posY = textEl.object3D.position.y;
          const posZ = textEl.object3D.position.z;
          
          // Construct position string in the form 'x y z'
          const positionStr = `${posX} ${posY} ${posZ}`;

          const serializedText = {
              value: textEl.getAttribute('value'),
              position: positionStr, // Use the manually constructed position string
              rotation: textEl.getAttribute('rotation'),
          
          };
          console.log("Serialized text:", serializedText);
          return serializedText;
      }
      return null;
  }).filter(text => text !== null); // Filter out any nulls if a triangle has no text

  console.log("All texts serialized:", serializedTexts);
  return serializedTexts;
},

  cancel: function () {
    let container = document.getElementById("aframe-container");
    let overlay = document.getElementById("overlay");
    let sky = document.querySelector('a-sky');
    let camera = this.el.sceneEl.querySelector("[camera]");
    let formContainer = document.getElementById("formContainer");
    let saveContainer = document.getElementById("saveContainer");
    const colorOptions = document.querySelectorAll(
      '.color-picker input[type="radio"]'
    );
    colorOptions.forEach((option) => {
      option.removeEventListener("change", this.handleColorInput);
    });


    this.cursor.setAttribute("toggle-thickness", "");
    sky.removeAttribute("markable");
    
    let newFov =80;
    camera.setAttribute("camera", "fov", newFov );
    this.el.sceneEl.emit('fovChanged', { fov: newFov });
  
  

    if (container) {
      container.style.width = "100vw";
      container.style.height = "100vh";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      container.style.padding = "0px";
      container.style.margin = "0px";
    }

    formContainer.innerHTML ='';
    saveContainer.style.display = 'flex';
this.remove();
  },
  

  changeColor: function (color) {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute("material", `color: ${color}`);
        triangle.setAttribute("material", `shader:flat`);
      });
    }
    console.log(this.el);
  },

  addText: function (input) {
    if (this.triangles) {
      this.triangles.forEach((triangle, index) => {
        if (index == 3) {
          let text = document.createElement("a-text");
          let camera = this.el.sceneEl.querySelector("[camera]");
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
            x:
              (this.positions[0].x +
                this.positions[1].x +
                this.positions[2].x +
                this.positions[3].x) /
              4,
            y:
              (this.positions[0].y +
                this.positions[1].y +
                this.positions[2].y +
                this.positions[3].y) /
              4,
            z:
              (this.positions[0].z +
                this.positions[1].z +
                this.positions[2].z +
                this.positions[3].z) /
              4,
          };
          midpoint.x += offset * Math.sin(angle);
          midpoint.z += offset * Math.cos(angle);

          text.setAttribute(
            "position",
            `${midpoint.x} ${midpoint.y} ${midpoint.z}`
          );
          console.log(text.getAttribute('position'));
          text.setAttribute("width", "30");

          this.el.setAttribute("id", input);
          triangle.appendChild(text);
          console.log(this.el);
        }
      });
    }
  },
  removeText: function () {
    if (this.triangles) {
      this.triangles.forEach((triangle, index) => {
        if (index == 3) {
          // Find the a-text element within the triangle
          let textElement = triangle.querySelector("a-text");

          // If an a-text element is found, remove it
          if (textElement) {
            triangle.removeChild(textElement);
          }
        }
      });
    }
  },

  createTriangles: function (positions, event) {
    let sky = document.querySelector("a-sky");

    let m = document.createElement("a-triangle");
    let mb = document.createElement("a-triangle");
    let mt = document.createElement("a-triangle");
    let mtb = document.createElement("a-triangle");

    this.triangles = [m, mb, mt, mtb];
    if(this.color){
    m.setAttribute("material", `color: ${this.color}`);
    mb.setAttribute("material", `color: ${this.color}`);
    mt.setAttribute("material", `color: ${this.color}`);
    mtb.setAttribute("material", `color: ${this.color}`);
    m.setAttribute("material", `color: ${this.color}`);
    mb.setAttribute("material", `color: ${this.color}`);
    mt.setAttribute("material", `color: ${this.color}`);
    mtb.setAttribute("material", `color: ${this.color}`);
    }
    m.setAttribute(
      "vertex-a",
      `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`
    );
    m.setAttribute(
      "vertex-b",
      `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`
    );
    m.setAttribute(
      "vertex-c",
      `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`
    );
    mb.setAttribute(
      "vertex-a",
      `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`
    );
    mb.setAttribute(
      "vertex-b",
      `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`
    );
    mb.setAttribute(
      "vertex-c",
      `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`
    );
    mt.setAttribute(
      "vertex-a",
      `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`
    );
    mt.setAttribute(
      "vertex-b",
      `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`
    );
    mt.setAttribute(
      "vertex-c",
      `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`
    );
    mtb.setAttribute(
      "vertex-a",
      `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`
    );
    mtb.setAttribute(
      "vertex-b",
      `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`
    );
    mtb.setAttribute(
      "vertex-c",
      `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`
    );

    this.el.setAttribute("class", sky.getAttribute("class"));
    this.el.appendChild(mb);
    this.el.appendChild(mt);
    this.el.appendChild(mtb);
    this.el.appendChild(m);
    console.log(this.el);
  },
});