AFRAME.registerComponent('markable', {
  init: function () {
   
    this.clickPositions = [];
    this.pointCounter = 0;
    const maxPoints = 4;
 
    this.draw = (e) => {
 
      if(this.pointCounter<maxPoints){
      let p = e.detail.intersection.point;
      let scene = document.querySelector('a-scene');
      let newPoint = document.createElement('a-entity');
      
      newPoint.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1,
      });
      newPoint.setAttribute('material', 'color:red');
      newPoint.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
      this.clickPositions.push({x: p.x, y: p.y, z: p.z});
      
      scene.appendChild(newPoint);
      
      this.pointCounter++;
    }
      if (this.pointCounter >= maxPoints) {

        this.el.emit('fourPointsCaptured', { positions: this.clickPositions });

        this.clickPositions = [];
      }
    };

    this.el.addEventListener('click', this.draw);
  }
});
