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
   

    this.identifier = null;
    this.hoverTimeout = null;
    this.triangles = [];
    this.cursor = document.getElementById("cursorRing");

    this.handleColorInput = this.handleColorInput.bind(this);
    const colorOptions = document.querySelectorAll(
      '.color-picker input[type="radio"]'
    );
    colorOptions.forEach((option) => {
      option.addEventListener("change", this.handleColorInput);
    });

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    const inputForm = document.querySelector(".inputForm");
    inputForm.addEventListener("input", this.handleFormSubmit);
    inputForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });
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
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      console.log('linker removed');
  } else {
      console.log('Element or parent of the element is not found')}
  },
    


  handleFormSubmit: function (event) {
    event.preventDefault();
    const textInput = document.getElementById("textInput").value;
    console.log("Form submitted, text input:", textInput);
    this.removeText();
    this.addText(textInput, this.positions);
  },

  handleColorInput: function (event) {
    this.changeColor(event.target.value);
  },

  save: function () {
    let eventData =  JSON.stringify({
      id: this.el.getAttribute("id"),
      class: this.el.getAttribute("class"),
      triangles: this.serializeTriangles(this.triangles),
      textData: this.serializeText(this.triangles),
    });


    this.el.sceneEl.emit("createWindow", eventData);
    console.log("[linker] Event 'createWindow' emitted with event details:" ,eventData);
    let container = document.getElementById("aframe-container");
    let overlay = document.getElementById("overlay");
    let camera = this.el.sceneEl.querySelector("[camera]");
    this.cursor.setAttribute("toggle-thickness", "");
    this.cursor.setAttribute("geometry", {
      radiusOuter: 0.03,
      radiusInner: 0.02,
    });

    camera.setAttribute("camera", "fov", "80");
    
    const colorOptions = document.querySelectorAll(
      '.color-picker input[type="radio"]'
    );
    colorOptions.forEach((option) => {
      option.removeEventListener("change", this.handleColorInput);
    });

    const inputForm = document.querySelector(".inputForm");
    inputForm.removeEventListener("submit", this.handleFormSubmit);
    inputForm.removeEventListener("input", this.handleFormSubmit);
   

    this.remove();

    if (container) {
      container.style.width = "100vw";
      container.style.height = "100vh";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      container.style.padding = "0px";
    }

  
  
  
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
              width: textEl.getAttribute('width'),
              align: textEl.getAttribute('align')
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
    let camera = this.el.sceneEl.querySelector("[camera]");
    const colorOptions = document.querySelectorAll(
      '.color-picker input[type="radio"]'
    );
    colorOptions.forEach((option) => {
      option.removeEventListener("change", this.handleColorInput);
    });

    const inputForm = document.querySelector(".inputForm");
    inputForm.removeEventListener("submit", this.handleFormSubmit);
    inputForm.removeEventListener("input", this.handleFormSubmit);
    this.cursor.setAttribute("toggle-thickness", "");

    this.cursor.setAttribute("geometry", {
      radiusOuter: 0.03,
      radiusInner: 0.02,
    });

    camera.setAttribute("camera", "fov", "80");

  
  

    if (container) {
      container.style.width = "100vw";
      container.style.height = "100vh";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      container.style.padding = "0px";
    }

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

    m.setAttribute("material", `shader:flat`);
    mb.setAttribute("material", `shader:flat`);
    mt.setAttribute("material", `shader:flat`);
    mtb.setAttribute("material", `shader:flat`);
    m.setAttribute("material", `shader:flat`);
    mb.setAttribute("material", `shader:flat`);
    mt.setAttribute("material", `shader:flat`);
    mtb.setAttribute("material", `shader:flat`);

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
