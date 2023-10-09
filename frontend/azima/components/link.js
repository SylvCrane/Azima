AFRAME.registerComponent('linker', {

  init: function () {
    console.log("[linker] Component initialized.");
  this.triangles = null;
    this.el.sceneEl.addEventListener('fourPointsCaptured', (event) => {
      this.positions = event.detail.positions;
      if (this.positions && this.positions.length >= 4) {
        this.createTriangles(this.positions);
      }
    });

    this.cursor = document.getElementById('cursorRing');

    this.cursor.addEventListener('raycaster-intersection', this.hoverEnd.bind(this));
     this.cursor.addEventListener('raycaster-intersection-cleared', this.hover.bind(this));


    this.el.addEventListener('click', () => {
      this.transition();
    });
    const colorWheel = document.getElementById('colorWheel');
    colorWheel.addEventListener('input', (event) => {
      this.changeColor(event.target.value);
    });
    document.body.addEventListener('save',()=>{
      let sky = document.querySelector('a-sky');
      let container = document.getElementById('aframe-container');
      let overlay = document.getElementById('overlay');
      let camera = this.el.sceneEl.querySelector('[camera]');
      camera.setAttribute('camera', 'fov', '80');
      sky.removeAttribute('markable', '');
      this.el.removeAttribute('linker','')
      if (container) {
      container.style.width = "100vw";
        container.style.height = "100vh";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        container.style.padding = "0px";
      }
       
    });
    


    const inputForm = document.querySelector('.inputForm');

      inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const textInput = document.getElementById('textInput').value;
        console.log('Form submitted, text input:', textInput);
        this.addText(textInput, this.positions);
      });
    },
    transition: function() {
      let sky = document.querySelector('a-sky');
    
      document.getElementById('overlay').style.opacity = '1';
      document.getElementById('overlay').style.zIndex = '1000';
    
      if (this.triangles) {
        this.triangles.forEach((triangle) => {
          let currentPosition = triangle.getAttribute('position');
          let newZ = currentPosition.z - 5;
          triangle.setAttribute('position', `${currentPosition.x} ${currentPosition.y} ${newZ}`);
    
          // If the triangle has a text child, move it as well
          let textEntity = triangle.querySelector('a-text');
          if (textEntity) {
            let textPosition = textEntity.getAttribute('position');
            let newTextZ = textPosition.z - 5;
            textEntity.setAttribute('position', `${textPosition.x} ${textPosition.y} ${newTextZ}`);
          }
        });
      }
    },

  hover: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 1}`);
      });
    }
  },
  hoverEnd: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 0.5}`);
      });
    }
  },

  changeColor : function (color){
      if (this.triangles) {
        this.triangles.forEach((triangle) => {
          triangle.setAttribute('material', `color: ${color}`);
          triangle.setAttribute('material', `shader:flat`);
        });
      }

  },

  addText: function(input) {
    if (this.triangles) {
        this.triangles.forEach((triangle, index) => {
          if(index ==3 ){
            let text = document.createElement('a-text');
          
            text.setAttribute('value', input);
            text.setAttribute('align', 'center');
        
            let midpoint = {
              x: (this.positions[0].x + this.positions[1].x + this.positions[2].x + this.positions[3].x) / 4,
              y: (this.positions[0].y + this.positions[1].y + this.positions[2].y + this.positions[3].y) / 4,
              z: (this.positions[0].z + this.positions[1].z + this.positions[2].z + this.positions[3].z) / 4
          };
        
            text.setAttribute('position', `${midpoint.x} ${midpoint.y} ${midpoint.z}`);
          
            let camera = this.el.sceneEl.querySelector('[camera]');
            let direction = new THREE.Vector3();
            camera.object3D.getWorldDirection(direction);
            direction.negate();
            let distance = 3;
            direction.multiplyScalar(distance);
      
            let camPos = camera.getAttribute('position');
            let textPos = {
                x: camPos.x + direction.x,
                y: camPos.y + direction.y,
                z: camPos.z + direction.z
            };
            console.log(textPos);
            console.log(midpoint);
           
           text.setAttribute('rotation', { x: 0, y: camera.getAttribute('rotation').y, z: 0 });
            text.setAttribute('width', '30'); 
     
            this.el.setAttribute('id', input);
            triangle.appendChild(text); 
        
          }
        });
    }
},
findNormal : function(A, B, C) {

  let AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
  let AC = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z };

 
  let normal = {
    x: AB.y * AC.z - AB.z * AC.y,
    y: AB.z * AC.x - AB.x * AC.z,
    z: AB.x * AC.y - AB.y * AC.x
  };

  return normal;
},
findAngles : function(){
  let normal1 = this.findNormal(this.positions[0], this.positions[1], this.positions[2]);
  let normal2 = this.findNormal(this.positions[0], this.positions[2], this.positions[3]);

  // Compute the average normal
  let averageNormal = {
    x: (normal1.x + normal2.x) / 2,
    y: (normal1.y + normal2.y) / 2,
    z: (normal1.z + normal2.z) / 2
  };
  let oppositeNormal = {
    x: -averageNormal.x,
    y: -averageNormal.y,
    z: -averageNormal.z
};

let angles = {
  x: Math.atan2(averageNormal.y, averageNormal.x) * (180/Math.PI),
  y: Math.atan2(averageNormal.z, averageNormal.y) * (180/Math.PI),
  z: Math.atan2(averageNormal.x, averageNormal.z) * (180/Math.PI)
};
  let oppositeAngles = {
  x: Math.atan2(oppositeNormal.y, oppositeNormal.x) *(180/Math.PI),
  y: Math.atan2(oppositeNormal.z, oppositeNormal.y) *(180/Math.PI),
  z: Math.atan2(oppositeNormal.x, oppositeNormal.z) *(180/Math.PI)
};
return {
  normalAngles: angles,
  oppositeAngles: oppositeAngles
};
},


  createTriangles: function (positions) {

    let m = document.createElement('a-triangle');
    let mb = document.createElement('a-triangle');
    let mt = document.createElement('a-triangle');
    let mtb = document.createElement('a-triangle');
    this.triangles = [m ,mb, mt, mtb];
    


    m.setAttribute('material', `shader:flat`);
    mb.setAttribute('material', `shader:flat`);
    mt.setAttribute('material', `shader:flat`);
    mtb.setAttribute('material', `shader:flat`);


    m.setAttribute('vertex-a', `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
    m.setAttribute('vertex-b', `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`);
    m.setAttribute('vertex-c', `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
    mb.setAttribute('vertex-a', `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
    mb.setAttribute('vertex-b', `${this.positions[1].x} ${this.positions[1].y} ${this.positions[1].z}`);
    mb.setAttribute('vertex-c', `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
    mt.setAttribute('vertex-a', `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);
    mt.setAttribute('vertex-b', `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`);
    mt.setAttribute('vertex-c', `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
    mtb.setAttribute('vertex-a', `${this.positions[0].x} ${this.positions[0].y} ${this.positions[0].z}`);
    mtb.setAttribute('vertex-b', `${this.positions[3].x} ${this.positions[3].y} ${this.positions[3].z}`);
    mtb.setAttribute('vertex-c', `${this.positions[2].x} ${this.positions[2].y} ${this.positions[2].z}`);

    this.el.appendChild(mb);
    this.el.appendChild(mt);
    this.el.appendChild(mtb);
    this.el.appendChild(m);
  }
});