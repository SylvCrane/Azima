AFRAME.registerComponent("window", {
  init: function () {
    console.log("init function called");
    console.log(this.el);
    this.delete = document.createElement("a-entity");
    this.delete.setAttribute("geometry", "primitive: circle; radius:0.25");
    this.delete.setAttribute("material", "color: #4ABFAA");
    this.delete.setAttribute("material", "opacity:0.8");
    this.delete.setAttribute(
      "text",
      "value:Remove Portal; align: center; width: 3"
    );
    this.delete.setAttribute("visible", false);
    this.el.sceneEl.appendChild(this.delete);

    this.cursor = document.getElementById("cursorRing");

    this.cursor.addEventListener(
      "raycaster-intersection",
      this.hover.bind(this)
    );
    this.cursor.addEventListener(
      "raycaster-intersection-cleared",
      this.hoverEnd.bind(this)
    );

    this.el.addEventListener("click", (event) => {
      let id = this.el.getAttribute("id");

      let className = this.el.getAttribute("class");

      current = document.getElementsByClassName(className);
      console.log(current);
      next = document.getElementsByClassName(id);
      console.log(next);
      let sky = document.getElementById(id);

      if (current) {
        for (let c of current) {
          if (c.tagName.toLowerCase() == "a-entity") {
            this.push(c);
          } else {
          }
        }
      }
      if (next) {
        for (let n of next) {
          if (n.tagName.toLowerCase() == "a-entity") {
            this.pull(n);
          }
        }
      }
      console.log(sky.id);
      this.load(sky.id);
    });
    
    this.el.addEventListener("move", () => {
      console.log("move received");

      let room = document.querySelector('a-sky');
      className = room.className;
      current = document.getElementsByClassName(className);
      
      console.log(current);
      
     
      let entities = document.querySelectorAll('a-entity');
      entities.forEach((entity) => {
        if (entity.className === className) {
          this.pull(entity); 
        }
        else{
          push(entity);
        }
      });
    
      console.log(room.id);
     
    });
  },

  hoverEnd: function (e) {
    let clearedEl = e.detail.clearedEls[0];

    if (clearedEl.parentNode === this.el) {
      // Change from parent check to this.el
      let triangles = this.el.querySelectorAll("a-triangle"); // Get triangles from this.el

      triangles.forEach((triangle) => {
        triangle.setAttribute("material", "opacity: 0.3");
      });

      // Clear the hover timeout and hide the delete button...
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
        // Hide the delete button...
      }
    }
    this.delete.setAttribute("visible", false);
  },

  hover: function (e) {
    let intersectedEl = e.detail.els[0];
    console.log(e.detail.els[0].parentNode);

    if (intersectedEl.parentNode === this.el) {
      // Change from parent check to this.el
      let triangles = this.el.querySelectorAll("a-triangle"); // Get triangles from this.el

      triangles.forEach((triangle) => {
        triangle.setAttribute("material", "opacity: 0.7");
      }); // Change from parent check to this.el

      this.hoverTimeout = setTimeout(() => {
        let camera = this.el.sceneEl.querySelector("[camera]");
        let direction = new THREE.Vector3();
        camera.object3D.getWorldDirection(direction);
        direction.negate();
        let distance = 3;
        direction.multiplyScalar(distance);

        let camPos = camera.getAttribute("position");
        let camRot = camera.getAttribute("rotation").y;

        function calculateButtonPosition(offsetAngle) {
          let angle = THREE.MathUtils.degToRad(camRot + offsetAngle);
          const offset = 0.5;
          const offsetX = Math.sin(angle) * offset;
          const offsetZ = Math.cos(angle) * offset;

          return {
            x: camPos.x + direction.x + offsetX,
            y: camPos.y + direction.y,
            z: camPos.z + direction.z + offsetZ,
          };
        }

        let buttonPos1 = calculateButtonPosition(50); // Offset by 30 degrees
        // Offset by -30 degrees

        this.delete.setAttribute(
          "position",
          `${buttonPos1.x} ${buttonPos1.y} ${buttonPos1.z}`
        );

        this.delete.setAttribute("rotation", { x: 0, y: camRot, z: 0 });

        this.delete.setAttribute("visible", true);

        // You can add your code to show the delete button here
      }, 3000);
    }
  },

  calcOffset: function (target) {
    console.log(target);
    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;
    let vertexCount = 0;

    triangles = this.el.querySelectorAll("a-triangle");
    triangles.forEach((triangle) => {
      ["vertex-a", "vertex-b", "vertex-c"].forEach((vertexAttribute) => {
        let vertex = triangle.getAttribute(vertexAttribute);

        if (vertex) {
          let [x, y, z] = vertex.split(" ").map(Number);
          totalX += x;
          totalY += y;
          totalZ += z;
          vertexCount += 1;
        }
      });
    });

    let midpoint = {
      x: totalX / vertexCount,
      y: totalY / vertexCount,
      z: totalZ / vertexCount,
    }; // Debugging: log the calculated midpoint

    return midpoint;
  },

  push: function (target) {
    let midpoint = this.calcOffset(target);
    console.log("Midpoint:", midpoint);
    target.setAttribute(
      "position",
      `${midpoint.x} ${midpoint.y} ${midpoint.z}`
    );
  },
  pull: function (target) {
    target.setAttribute("position", `0 0 0`);

    if (target.triangles) {
      target.triangles.forEach((triangle) => {
        let textEntity = triangle.querySelector("a-text");
        if (textEntity) {
          vertex = triangle.getAttribute("vertex-a");
          textEntity.setAttribute("position", "0 0 0 ");
        }
      });
    }
  },
  load: function (id) {
    console.log("ID:", id); // Log the value of id
    let sky = document.querySelector("a-sky");
    console.log("Class before:", sky.className); // Log the class attribute before updating
    sky.setAttribute("src", "#" + id);
    sky.setAttribute("class", id);
    console.log("Class after:", sky.className);
  },
});
