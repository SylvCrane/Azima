AFRAME.registerComponent('toggle-thickness', {
  init: function() {

    console.log(AFRAME);
      this.isThick = false;
      this.isFocused = false;
      this.plus = document.createElement('button');
      this.plus.className = "plus-button";
      this.plus.innerText = "+";
      
      this.button = document.createElement('a-entity');
      this.button.setAttribute('geometry', 'primitive: circle; radius:0.25');
      this.button.setAttribute('material', 'color: #4ABFAA');
      this.button.setAttribute('material', 'opacity:0.8');
      this.button.setAttribute('text', 'value: Add View; align: center; width: 5');
      this.button.setAttribute('visible', false);
      this.el.sceneEl.appendChild(this.button);

      this.cursor = document.getElementById('cursorRing');

      this.boundHandleButtonClick = this.handleButtonClick.bind(this);
      this.boundHandlePlusClick = this.handlePlusClick.bind(this);
      this.boundHandleCursorClick = this.handleCursorClick.bind(this);

      this.button.addEventListener('click', this.boundHandleButtonClick);
      this.plus.addEventListener('click', this.boundHandlePlusClick);
      this.cursor.addEventListener('click', this.boundHandleCursorClick);

    
       this.cursor.addEventListener('raycaster-intersection', this.handleHover.bind(this));
       this.cursor.addEventListener('raycaster-intersection-cleared', this.handleHoverEnd.bind(this));
  },

  handleButtonClick: function(e) {
      e.stopPropagation();
      console.log("click button");
      this.addView();
  },

  handleHover: function(evt) {
      if (evt.detail.els.includes(this.button)) {
          this.cursor.setAttribute('material','opacity: 0.5');
      }
  },
  handleHoverEnd: function(evt) {
    if (!evt.detail.els) {
        this.cursor.setAttribute('material','opacity:1');
    }
},

  handlePlusClick: function() {
      console.log("click");
      let camera = this.el.sceneEl.querySelector('[camera]');
      let direction = new THREE.Vector3();
      camera.object3D.getWorldDirection(direction);
      direction.negate();
      let distance = 3;
      direction.multiplyScalar(distance);

      let camPos = camera.getAttribute('position');
      let buttonPos = {
          x: camPos.x + direction.x,
          y: camPos.y + direction.y,
          z: camPos.z + direction.z
      };

      this.button.setAttribute('position', buttonPos);
      this.button.setAttribute('rotation', { x: 0, y: camera.getAttribute('rotation').y, z: 0 });
      this.button.setAttribute('visible', true);
      this.el.setAttribute('geometry', {
          radiusOuter: 0.03
      });
  },

  handleCursorClick: function() {
      let currentRadiusOuter = this.el.getAttribute('geometry').radiusOuter;

      if (this.isThick) {
          newRadiusOuter = 0.03;
          this.button.setAttribute('visible', false);
          this.plus.remove();
      } else {
          document.body.appendChild(this.plus);
          newRadiusOuter = currentRadiusOuter + 0.01;
      }
      this.el.setAttribute('geometry', {
          radiusOuter: newRadiusOuter
      });

      this.isThick = !this.isThick;
  },
  addView: function() {
    if (this.el.sceneEl.contains(this.button)) {
      let sky = document.querySelector('a-sky');
    this.el.sceneEl.removeChild(this.button);
    this.plus.remove();
    let link = document.createElement('a-entity');
    link.setAttribute('linker', {});
   
    console.log("linker made:");
    this.el.sceneEl.appendChild(link);

    let container = document.getElementById('aframe-container');
    let overlay = document.getElementById('overlay');

    if (container) {
        this.isFocused = true;
        container.style.width = "75vw";
        container.style.height = "75vh";
        overlay.style.width = "75vw";
        overlay.style.height = "75vh";
        container.style.padding = "50px";

        let camera = this.el.sceneEl.querySelector('[camera]');
        camera.setAttribute('camera', 'fov', '20');

        // Use the bound version of the function to remove
        this.cursor.removeEventListener('click', this.boundHandleCursorClick);
        console.log("tick");
        
        console.log('Adding markable component to sky');
        sky.setAttribute('markable', '');
        console.log('Markable component added to sky');
        
    }
}
else{
  this.cursor.setAttribute('geometry', {
    radiusOuter: 0.003,
    radiusInner: 0.002
});
this.cursor.removeAttribute('toggle-thickness');
  return;
}

  }
});
