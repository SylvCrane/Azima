AFRAME.registerComponent('window', {
 
  init: function() {
    console.log('init function called');
      this.triangles = [];
    this.data.triangles = Array.from(this.el.querySelectorAll('a-triangle'));

      this.cursor = document.getElementById('cursorRing');



      

      this.el.addEventListener('click', () => {
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



    this.cursor.addEventListener('raycaster-intersection', this.hoverEnd.bind(this));
     this.cursor.addEventListener('raycaster-intersection-cleared', this.hover.bind(this));
  },
  hover: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 0.3`);
      });
    }
  },
  hoverEnd: function() {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: 0.7`);
      });
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
