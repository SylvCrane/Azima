AFRAME.registerComponent('markable', {

  init: function () {
    this.identifier = this.generateUniqueIdentifier(); 
    this.clickPositions = [];
    this.pointCounter = 0;
    this.newPoints = [];
    this.initPos = null;
    let release = null;
    this.cursor = document.getElementById('cursorRing');

    document.body.addEventListener('save',()=>{
      this.save();

    })
    document.body.addEventListener('cancel', ()=>{
this.save();
    })
   
    this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
    this.boundMouseUpHandler = this.mouseUpHandler.bind(this);

    this.el.addEventListener('mousedown', this.boundMouseDownHandler);
    this.el.addEventListener('mouseup', this.boundMouseUpHandler);

      if (this.initPos &&release && release.equals(this.initPos)) {
        console.log("draw");
        this.draw();  
      } else {
       
      }
      this.cursor.addEventListener('raycaster-intersection', (e)=>{
        if (this.newPoints) {
          this.newPoints.forEach((point) => {
            if (e.detail.els.includes(point)){
              point.setAttribute('material','color:white');
              
            }
          });
        }
      });
      this.cursor.addEventListener('raycaster-intersection-cleared', (e)=>{
        if (this.newPoints) {
          this.newPoints.forEach((point) => {
            if (!e.detail.els){
              point.setAttribute('material','color: #0A7A68');
            }
          });
        }
      });
    } ,

  
  
  draw : function () {

    const maxPoints = 4;
    if (this.pointCounter < maxPoints) {
      console.log("[markable] Point captured at:", this.initPos);
      console.log(this.el);
   
      let scene = document.querySelector('a-scene');
      let newPoint = document.createElement('a-entity');
    
      newPoint.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1,
      });
      newPoint.setAttribute('material', 'color: #09483E');
      newPoint.setAttribute('position', `${this.initPos.x} ${this.initPos.y} ${this.initPos.z}`);
      newPoint.setAttribute('id', this.pointCounter);
      newPoint.setAttribute('markable', '');


    
      this.clickPositions.push(this.initPos);
      this.newPoints.push(newPoint);
      scene.appendChild(newPoint);
 
      
      
      this.pointCounter++;
    }
    if (this.pointCounter >= maxPoints) {
     this.initTriangles();
    }
  

  },


  initTriangles: function() {
    console.log("[markable] Emitting 'fourPointsCaptured' event with positions:", this.clickPositions, "and identifier:", this.identifier);
    this.el.emit('fourPointsCaptured', { positions: this.clickPositions, identifier: this.identifier });
    console.log("[markable] Event 'fourPointsCaptured' emitted.");

  },
  save : function(){
    console.log("saved recieved");
 
    if(this.el.getAttribute('radius')){
      let sky = document.querySelector('a-sky');
      let data = sky.components.markable;
        console.log(sky.components);
        console.log("save event triggered");
      
        if (data.newPoints) {
          data.newPoints.forEach((point) => {
           
            
            point.remove();
           
         });
       sky.removeAttribute('markable');
       this.el.removeEventListener('mousedown', this.boundMouseDownHandler);
       this.el.removeEventListener('mouseup', this.boundMouseUpHandler);
       }
        
       
  
  
        
        
       
        data.pointCounter =0;
        data.clickPositions =[];
        data.newPoints =[];
        sky.removeAttribute('markable');
    }
    



  },
  

  erase: function(point){
    let sky = document.querySelector('a-sky');
    let data = sky.components.markable;
    console.log('erase');
    console.log(data.pointCounter);
    console.log(data.clickPositions);
    if(data.pointCounter === 4){
      
      this.el.emit("fourPointsRemoved", {identifier: data.identifier});
    }
    const index = data.newPoints.indexOf(point);
  
    if (index > -1) {
        data.newPoints.splice(index, 1);
        data.clickPositions.splice(index, 1);
        data.pointCounter--;  
    }
    if(point && point.parentNode){
        point.remove();
    }
   
    console.log('erased');
    console.log(data.pointCounter);
    console.log(data.clickPositions);
},



mouseDownHandler: function(e) {
  release = null;

  if (e.detail && e.detail.intersection) {
     
    this.initPos = e.detail.intersection.point;

  
}
},


mouseUpHandler: function(e) {
  
  if (e.detail && e.detail.intersection) {
   
      release = e.detail.intersection.point;
   

    }

    
    if (this.initPos &&release && release.equals(this.initPos)) {
      
      console.log(this.el);


     
        if(this.el.getAttribute('radius')){
        console.log("draw");
        this.draw();  
     
        }
        else {
          
          this.erase(this.el);
        }
      
        
    } else {
     
    
}
},

generateUniqueIdentifier: function() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
},

});
  

