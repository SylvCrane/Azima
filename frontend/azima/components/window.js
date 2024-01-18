AFRAME.registerComponent('window', {
 
  init: function() {
    console.log('init function called');
    this.el.sceneEl.addEventListener('createWindow', (event) => {
      console.log("Received createWindow event", event.detail);

      // Use event.detail to build your window object
      this.buildWindow(event.detail);
  });


      this.delete = document.createElement('a-entity');
  this.delete.setAttribute('geometry', 'primitive: circle; radius:0.25');
  this.delete.setAttribute('material', 'color: #4ABFAA');
  this.delete.setAttribute('material', 'opacity:0.8');
  this.delete.setAttribute('text', 'value:Remove Portal; align: center; width: 3');
  this.delete.setAttribute('visible', false);
  this.el.sceneEl.appendChild(this.delete);
   

      this.cursor = document.getElementById('cursorRing');

    

    // this.cursor.addEventListener('raycaster-intersection', this.hover.bind(this));
    // this.cursor.addEventListener('raycaster-intersection-cleared', this.hoverEnd.bind(this));


      

      this.el.addEventListener('click', (event) => {
        console.log('Event target:', event.target.parentNode);
        entity = event.target.parentNode;
       
        let id =entity.getAttribute('id');
      
       let className = entity.getAttribute('class');
  
        current = document.getElementsByClassName(className);
     
        next = document.getElementsByClassName(id);
       let sky = document.getElementById(id);

      
       if(current){
        for(let c of current) {
         
          if(c.tagName.toLowerCase() =='a-entity' ){
            this.triangles = Array.from(c.querySelectorAll('a-triangle'));
        
        this.push(c);
          }
          else{
       
          }
        }

       }
        if(next){
          for(let n of next) {
            if(n.tagName.toLowerCase() =='a-entity' ){
              this.pull(n);
            }
            
            
       
          }
        }
        console.log(sky.id);
        this.load(sky.id);
      });



   
  },

  buildWindow: function(data) {
    // Clear existing content if necessary
    while (this.el.firstChild) {
        this.el.removeChild(this.el.firstChild);
    }

    // Create and add triangles
    data.triangles.forEach(triangleData => {
        let triangleEl = document.createElement('a-triangle');
        triangleEl.setAttribute('vertex-a', triangleData.vertexA);
        triangleEl.setAttribute('vertex-b', triangleData.vertexB);
        triangleEl.setAttribute('vertex-c', triangleData.vertexC);
        triangleEl.setAttribute('material', `color: ${triangleData.color}`);
        this.el.appendChild(triangleEl);
    });

    // Create and add text elements
    data.textData.forEach(textInfo => {
        let textEl = document.createElement('a-text');
        textEl.setAttribute('value', textInfo.value);
        textEl.setAttribute('position', textInfo.position);
        textEl.setAttribute('rotation', textInfo.rotation);
        textEl.setAttribute('width', textInfo.width);
        textEl.setAttribute('align', textInfo.align);
        this.el.appendChild(textEl);
    });

    // Set class and ID from data
    this.el.setAttribute('class', data.class);
    this.el.setAttribute('id', data.id);

    // Additional setup or adjustments can be done here
},



  hoverEnd: function(e) {
    let clearedEl = e.detail.clearedEls[0];
    console.log(clearedEl.parentNode);

    if (clearedEl.parentNode.tagName.toLowerCase() === 'a-entity') {
     let triangles = Array.from(clearedEl.parentNode.querySelectorAll('a-triangle'));
    
         triangles.forEach(triangle => {
             triangle.setAttribute('material', 'opacity: 0.3');
         });



        // Clear the hover timeout when the intersection is cleared
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null; // Reset the timeout property
           
      
            // You can add your code to hide the delete button here
        }
    }
    this.delete.setAttribute('visible', false);
  },


hover: function(e) {

let intersectedEl = e.detail.els[0];
console.log("intersected",intersectedEl);
if (intersectedEl.parentNode.tagName.toLowerCase() === 'a-entity') {
 let triangles = Array.from(intersectedEl.parentNode.querySelectorAll('a-triangle'));

     triangles.forEach(triangle => {
         triangle.setAttribute('material', 'opacity: 0.7');
     });





    this.hoverTimeout = setTimeout(() => {
    
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
      // Offset by -30 degrees
  
      this.delete.setAttribute('position', `${buttonPos1.x} ${buttonPos1.y} ${buttonPos1.z}`);

      this.delete.setAttribute('rotation', { x: 0, y: camRot, z: 0 });
   
      this.delete.setAttribute('visible', true);
   
        // You can add your code to show the delete button here
    }, 3000);
  
}
},



  calcOffset: function(target) {
    console.log(target);
    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;
    let vertexCount = 0;
  
     // Debugging: log the triangles array
  
    if (this.triangles) {
      this.triangles.forEach(triangle => {
  // Debugging: log each triangle
        ['vertex-a', 'vertex-b', 'vertex-c'].forEach(vertexAttribute => {
          let vertex = triangle.getAttribute(vertexAttribute);
   // Debugging: log the vertex data
          if (vertex) {  // Ensure vertex is not null or undefined
            let [x, y, z] = vertex.split(' ').map(Number);
            totalX += x;
            totalY += y;
            totalZ += z;
            vertexCount += 1;
          }
        });
      });
    }
  
    let midpoint = {
      x: totalX / vertexCount,
      y: totalY / vertexCount,
      z: totalZ / vertexCount
    };
  
;  // Debugging: log the calculated midpoint
  
    return midpoint;
  },
  

  push: function(target) {
  
    let midpoint = this.calcOffset(target);
    console.log('Midpoint:', midpoint);
  target.setAttribute('position', `${midpoint.x} ${midpoint.y} ${midpoint.z}`);
   
  
    if (target.triangles) {
      target.triangles.forEach((triangle) => {
        let textEntity = triangle.querySelector('a-text');
        if (textEntity) {
          vertex = triangle.getAttribute('vertex-a');
          textEntity.setAttribute('position', vertex);
        }
      });
    }
  },
  pull : function (target){
    target.setAttribute('position', `0 0 0`);

    if (target.triangles) {
      target.triangles.forEach((triangle) => {
        let textEntity = triangle.querySelector('a-text');
        if (textEntity) {
          vertex = triangle.getAttribute('vertex-a');
          textEntity.setAttribute('position', '0 0 0 ');
        }
      });
    }
  },
  load: function(id){

    console.log('ID:', id);  // Log the value of id
    let sky = document.querySelector('a-sky');
    console.log('Class before:', sky.className);  // Log the class attribute before updating
    sky.setAttribute('src','#'+ id);
    sky.setAttribute('class', id);
    console.log('Class after:', sky.className);  
  }
  
});

