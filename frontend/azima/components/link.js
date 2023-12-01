AFRAME.registerComponent('linker', {

  init: function () {
    console.log("[linker] Component initialized.");

  this.triangles = null;
  this.identifier = null;
  this.hovertimeout;
  this.drawCount =0;
  
  this.el.sceneEl.addEventListener('fourPointsCaptured', (event) => {
    console.log("[linker] 'fourPointsCaptured' event received with detail:", event.detail);
  
    // If the identifier has already been set and the new event's identifier doesn't match it, then ignore the event.
    if (this.identifier && event.detail.identifier !== this.identifier) {
      console.log("[linker] Identifier mismatch. Ignoring event.");
      return;
    }
  
   
    if (!this.identifier) {
      this.identifier = event.detail.identifier;
    }
  
    this.positions = event.detail.positions;
    if (this.positions && this.positions.length >= 4&& this.drawCount<1) {
      this.createTriangles(this.positions, event);
    }
  });
  this.el.sceneEl.addEventListener('fourPointsRemoved', (event) => {
    console.log("[linker] 'fourPointsRemoved' event received with detail:", event.detail);
  
    // If the identifier has already been set and the new event's identifier doesn't match it, then ignore the event.
    if (this.identifier && event.detail.identifier !== this.identifier) {
      console.log("[linker] Identifier mismatch. Ignoring event.");
      return;
    }else{
      this.removeTriangles();
    }
  
   
    if (!this.identifier) {
      this.identifier = event.detail.identifier;
    }

    
  });


    this.cursor = document.getElementById('cursorRing');

   


    this.handleColorInput = this.handleColorInput.bind(this);

    const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
    colorOptions.forEach(option => {
      option.addEventListener('change', this.handleColorInput);
    });


    
    document.body.addEventListener('save',()=>{
      
this.save();
      
    });
    document.body.addEventListener('cancel', ()=>{
      this.cancel();

    });
   


    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    const inputForm = document.querySelector('.inputForm');

      inputForm.addEventListener('input', this.handleFormSubmit);
      inputForm.addEventListener('submit', function(event) {
        event.preventDefault();
      });
      

    },
    removeTriangles : function(){
      if (this.triangles) {
        this.triangles.forEach((triangle) => {
       this.el.removeChild(triangle);
        });
      }
      this.drawCount -=1;
    },



    handleFormSubmit: function(event) {
    
      event.preventDefault();
      const textInput = document.getElementById('textInput').value;
      console.log('Form submitted, text input:', textInput);
      this.removeText();
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
      const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
      colorOptions.forEach(option => {
        option.removeEventListener('change', this.handleColorInput);
      });

    const inputForm = document.querySelector('.inputForm');
    inputForm.removeEventListener('submit', this.handleFormSubmit);
inputForm.removeEventListener('input', this.handleFormSubmit);
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
    cancel : function(){
      if(this.drawCount ===1){
        this.drawCount-=1;
      }
    
      let sky = document.querySelector('a-sky');
      let container = document.getElementById('aframe-container');
      let overlay = document.getElementById('overlay');
      let camera = this.el.sceneEl.querySelector('[camera]');
      const colorOptions = document.querySelectorAll('.color-picker input[type="radio"]');
      colorOptions.forEach(option => {
        option.removeEventListener('change', this.handleColorInput);
      });

    const inputForm = document.querySelector('.inputForm');
    inputForm.removeEventListener('submit', this.handleFormSubmit);
inputForm.removeEventListener('input', this.handleFormSubmit);
      this.cursor.setAttribute('toggle-thickness', '');

      this.cursor.setAttribute('geometry', {
        radiusOuter: 0.03,
        radiusInner: 0.02
    });

      camera.setAttribute('camera', 'fov', '80');
     
      if(this.triangles)
{
  this.removeTriangles();
  this.removeText();
}    
    
      this.el.removeAttribute('linker');

      if (container) {
      container.style.width = "100vw";
        container.style.height = "100vh";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        container.style.padding = "0px";
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
            let camera = this.el.sceneEl.querySelector('[camera]');
            let direction = new THREE.Vector3();
            camera.object3D.getWorldDirection(direction);
            direction.negate();
            let distance = 3;
            direction.multiplyScalar(distance);
      
            text.setAttribute('value', input);
            text.setAttribute('align', 'center');
        

           let rotation = camera.getAttribute('rotation').y;
           let angle = THREE.MathUtils.degToRad(rotation);
           text.setAttribute('rotation', { x: 0, y: rotation, z: 0 });
      
            let offset = 0.3;
           
          

           let midpoint = {
            x: (this.positions[0].x + this.positions[1].x + this.positions[2].x + this.positions[3].x) / 4,
            y: (this.positions[0].y + this.positions[1].y + this.positions[2].y + this.positions[3].y) / 4,
            z: (this.positions[0].z + this.positions[1].z + this.positions[2].z + this.positions[3].z) / 4
        };
        midpoint.x += offset * Math.sin(angle);
        midpoint.z += offset * Math.cos(angle);

            text.setAttribute('position', `${midpoint.x} ${midpoint.y} ${midpoint.z}`);
            console.log(midpoint);
            text.setAttribute('width', '30'); 

     
            this.el.setAttribute('id', input);
            triangle.appendChild(text); 
        
          }
        });
    }
},
removeText: function() {
  if (this.triangles) {
      this.triangles.forEach((triangle, index) => {
          if (index == 3) {
              // Find the a-text element within the triangle
              let textElement = triangle.querySelector('a-text');

              // If an a-text element is found, remove it
              if (textElement) {
                  triangle.removeChild(textElement);
              }
          }
      });
  }
},






  createTriangles: function (positions, event) {
    this.drawCount+=1;

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