AFRAME.registerComponent('linker', {

  init: function () {
    console.log("[linker] Component initialized.");

  this.triangles = null;
    this.el.sceneEl.addEventListener('fourPointsCaptured', (event) => {
      console.log("[linker] 'fourPointsCaptured' event received with detail:", event.detail);
      this.identifier = event.detail.identifier;
  if (event.detail.identifier !== this.identifier) {
    console.log("[linker] Identifier mismatch. Ignoring event.");
    return;
  }
  this.positions = event.detail.positions;
  if (this.positions && this.positions.length >= 4) {
    console.log("[linker] Enough positions received. Calling createTriangles.");
    this.createTriangles(this.positions, event);
  }
},{ once: true });

    this.cursor = document.getElementById('cursorRing');

    this.cursor.addEventListener('raycaster-intersection', this.hoverEnd.bind(this));
     this.cursor.addEventListener('raycaster-intersection-cleared', this.hover.bind(this));


    this.handleColorInput = this.handleColorInput.bind(this);
    const colorWheel = document.getElementById('colorWheel');
    colorWheel.addEventListener('input', this.handleColorInput);
    document.body.addEventListener('save',()=>{
      
this.save();
      
    });
    

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    const inputForm = document.querySelector('.inputForm');

      inputForm.addEventListener('submit', this.handleFormSubmit);
        
      

    },
    handleFormSubmit: function(event) {
      event.preventDefault();
      const textInput = document.getElementById('textInput').value;
      console.log('Form submitted, text input:', textInput);
      this.addText(textInput, this.positions);
    },
    handleColorInput: function(event){
      this.changeColor(event.target.value);
    },
  
    save : function(){
      let sky = document.querySelector('a-sky');
      let container = document.getElementById('aframe-container');
      let overlay = document.getElementById('overlay');
      let camera = this.el.sceneEl.querySelector('[camera]');
      const colorWheel = document.getElementById('colorWheel');
    colorWheel.removeEventListener('input', this.handleColorInput);

    const inputForm = document.querySelector('.inputForm');
    inputForm.removeEventListener('submit', this.handleFormSubmit);

      this.cursor.setAttribute('toggle-thickness', '');

      this.cursor.setAttribute('geometry', {
        radiusOuter: 0.03,
        radiusInner: 0.02
    });

      camera.setAttribute('camera', 'fov', '80');
     
      this.el.setAttribute('window', '');

    
    
      this.el.removeAttribute('linker');
     
      if (container) {
      container.style.width = "100vw";
        container.style.height = "100vh";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        container.style.padding = "0px";
      }





    },
  

  hover: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 0.3}`);
      });
    }
  },
  hoverEnd: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 0.7}`);
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






  createTriangles: function (positions, event) {
  

    let sky = document.querySelector('a-sky');

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

    this.el.setAttribute('class',sky.getAttribute('class'));
    this.el.appendChild(mb);
    this.el.appendChild(mt);
    this.el.appendChild(mtb);
    this.el.appendChild(m);
  }
});