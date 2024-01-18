AFRAME.registerComponent('markable', {

  init: function () {
    this.identifier = this.generateUniqueIdentifier(); 
    this.clickPositions = [];
    this.pointCounter = 0;
    this.newPoints = [];
    this.initPos = null;
    let release = null;
    this.maxPoints = 4;
    this.cursor = document.getElementById('cursorRing');

    document.body.addEventListener('save',()=>{
      this.save();

    })
    document.body.addEventListener('cancel', ()=>{
this.cancel();
    })
   
    this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
    this.boundMouseUpHandler = this.mouseUpHandler.bind(this);

    this.el.addEventListener('mousedown', this.boundMouseDownHandler);
    this.el.addEventListener('mouseup', this.boundMouseUpHandler);

      
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
      
      newPoint.addEventListener('click', (event) => {
        this.erase(event.target);
    });

    
      this.clickPositions.push(this.initPos);
      this.newPoints.push(newPoint);
      scene.appendChild(newPoint);
 
      
      
      this.pointCounter++;
    
    if (this.pointCounter >= this.maxPoints) {
     this.initTriangles();
    }
  

  },
  erase: function(point) {
    
    const index = this.newPoints.indexOf(point);
    if (this.pointCounter === 4) {
      this.el.emit("fourPointsRemoved", { identifier: this.identifier });
  }
 
    if (index > -1) {
        this.newPoints.splice(index, 1);
        this.clickPositions.splice(index, 1);
        this.pointCounter--;
        
    }


    if (point && point.parentNode) {
      point.remove();
  }
  
    
},


  initTriangles: function() {
    console.log("[markable] Emitting 'fourPointsCaptured' event with positions:", this.clickPositions, "and identifier:", this.identifier);
    this.el.emit('fourPointsCaptured', { positions: this.clickPositions, identifier: this.identifier });
    console.log("[markable] Event 'fourPointsCaptured' emitted.");

  },
  save : function(){
    console.log("saved recieved");
 
    
      
        
        console.log("save event triggered");
      
        if (this.newPoints) {
          this.newPoints.forEach((point) => {
           
            
            point.remove();
           
         });
       
       
        
       
  
  
        
        
       
        this.pointCounter =0;
        this.clickPositions =[];
        this.newPoints =[];
        this.el.removeAttribute('markable');
       this.el.removeEventListener('mousedown', this.boundMouseDownHandler);
       this.el.removeEventListener('mouseup', this.boundMouseUpHandler);
    }
    



  },
  cancel : function(){
    console.log("cancel recieved");
 
    
      
        
        console.log("cancel event triggered");
      
        if (this.newPoints) {
          this.newPoints.forEach((point) => {
           
            
            point.remove();
           
         });
        }
         if (this.pointCounter === 4) {
          this.el.emit("fourPointsRemoved", { identifier: this.identifier });
       
       
        
       
  
  
        
        
       
        this.pointCounter =0;
        this.clickPositions =[];
        this.newPoints =[];
        this.el.removeAttribute('markable');
       this.el.removeEventListener('mousedown', this.boundMouseDownHandler);
       this.el.removeEventListener('mouseup', this.boundMouseUpHandler);
    }
    



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


     
        if(this.pointCounter<this.maxPoints){
        console.log("draw");
        this.draw();  
     
        }
       
      
        
    } else {
     
    
}
},

generateUniqueIdentifier: function() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
},

});
  

