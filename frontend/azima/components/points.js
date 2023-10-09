AFRAME.registerComponent('markable', {
  init: function () {
   
    this.clickPositions = [];
    this.pointCounter = 0;
    this.newPoints = [];
    this.initPos = null;
    let release = null;
    this.cursor = document.getElementById('cursorRing');

    document.body.addEventListener('save',()=>{
      console.log("saved recieved");
      if (this.newPoints) {
        this.newPoints.forEach((point) => {
         
           point.remove();
          
        });
      }
    })

    this.el.addEventListener('mousedown', (e) => {
      release = null;
      if (e.detail && e.detail.intersection) {
        this.initPos = e.detail.intersection.point;
        console.log("[markable] mouse down at:", this.initPos);
        console.log("[markable] mouse up at:", release);
      }
    })
    
    this.el.addEventListener('mouseup', (e) => {
      if (e.detail && e.detail.intersection) {
        release = e.detail.intersection.point;
        console.log("[markable] mouse down at:", this.initPos);
        console.log("[markable] mouse up at:", release);

      }
        
      if (this.initPos &&release && release.equals(this.initPos)) {
        console.log("draw");
        this.draw();  
      } else {
       
      }
      
    });
  },
  draw : function () {
    const maxPoints = 4;
    if (this.pointCounter < maxPoints) {
      console.log("[markable] Point captured at:", this.initPos);
      let scene = document.querySelector('a-scene');
      let newPoint = document.createElement('a-entity');
    
      newPoint.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1,
      });
      newPoint.setAttribute('material', 'color:red');
      newPoint.setAttribute('position', `${this.initPos.x} ${this.initPos.y} ${this.initPos.z}`);

      this.clickPositions.push(this.initPos);
      this.newPoints.push(newPoint);
      scene.appendChild(newPoint);
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
              point.setAttribute('material','color:red');
            }
          });
        }
      });
      
      
      this.pointCounter++;
    }
    if (this.pointCounter >= maxPoints) {
     this.initTriangles();
    }
  },
  initTriangles: function() {
    console.log("[markable] Emitting 'fourPointsCaptured' event with positions:", this.clickPositions);
    this.el.emit('fourPointsCaptured', { positions: this.clickPositions });
    this.clickPositions = [];
  },
  
});
