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

    this.el.addEventListener("click", () => {
      let id = this.el.getAttribute("id");
      console.log(id);
      let className = this.el.getAttribute("class");
      console.log(className);
      let current = document.getElementsByClassName(className);
      console.log(current);
      let next = document.getElementsByClassName(id);
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

    document.addEventListener("move", (e) => {
      let sky = document.querySelector("a-sky");
      let className = sky.getAttribute("class");
      if (this.el.getAttribute("class") === e.detail.id){
        this.pull(this.el);  
      }
      else if(this.el.getAttribute("id") === e.detail.id){
        this.push(this.el);
      }
      else{
        this.push(this.el);
      }
      
      document.removeEventListener("move", (e));
    });
    

      this.el.addEventListener("load", (e) => {
        console.log("load received");
  
        let room = document.querySelector('a-sky');
      let className = room.getAttribute("class");
      if (e.target.getAttribute('class')===className){
        this.pull(e.target);
      }
      else{
        this.push(e.target);
      }

        
     
        
       
      
     
    });
  },

  hoverEnd: function (e) {
  
  },

  hover: function (e) {
    
  },

  calcOffset: function (target) {

    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;
    let vertexCount = 0;

   let triangles = this.el.querySelectorAll("a-triangle");
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
    target.setAttribute("position", `0 0 0`);
    console.log("push" ,target, target.getAttribute("position"));

    let midpoint = this.calcOffset(target);
    console.log(midpoint);
    target.setAttribute(
      "position",
      `${midpoint.x} ${midpoint.y} ${midpoint.z}`
    );
    console.log("pushed" ,target, target.getAttribute("position"));
  },
  pull: function (target) {
    console.log("pull" ,target, target.getAttribute("position"));
    target.setAttribute("position", `0 0 0`);
    console.log("pulled" ,target, target.getAttribute("position"));
   
  },
  load: function (id) {
    console.log("ID:", id); // Log the value of id
    
    let sky = document.querySelector("a-sky");
    console.log("Class before:", sky.className); // Log the class attribute before updating
    sky.setAttribute("src", "#"+id);
    sky.setAttribute("class", id);
    console.log("Class after:", sky.className);
  },
});