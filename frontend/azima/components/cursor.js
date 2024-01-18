AFRAME.registerComponent('toggle-thickness', {
  init: function() {
      this.isThick = false;
      this.isFocused = false;
      this.plus = document.createElement('button');
      this.plus.className = "plus-button";
      this.plus.innerText = "+";
      
      this.addView = document.createElement('a-entity');
      this.addView.setAttribute('geometry', 'primitive: circle; radius:0.25');
      this.addView.setAttribute('material', 'color: #4ABFAA');
      this.addView.setAttribute('material', 'opacity:0.8');
      this.addView.setAttribute('text', 'value: Add Room; align: center; width: 3');
      this.addView.setAttribute('visible', false);
      this.addMarker = document.createElement('a-entity');
      this.addMarker.setAttribute('geometry', 'primitive: circle; radius:0.25');
      this.addMarker.setAttribute('material', 'color: #4ABFAA');
      this.addMarker.setAttribute('material', 'opacity:0.8');
      this.addMarker.setAttribute('text', 'value: Add Marker; align: center; width: 3');
      this.addMarker.setAttribute('visible', false);
      this.el.sceneEl.appendChild(this.addView);
      this.el.sceneEl.appendChild(this.addMarker);

      this.cursor = document.getElementById('cursorRing');



      this.boundHandleAddViewClick = this.handleAddViewClick.bind(this);
      this.boundHandlePlusClick = this.handlePlusClick.bind(this);
      this.boundHandleCursorClick = this.handleCursorClick.bind(this);

      this.addView.addEventListener('click', this.boundHandleAddViewClick);
      this.plus.addEventListener('click', this.boundHandlePlusClick);
      this.cursor.addEventListener('click', this.boundHandleCursorClick);

    
       this.cursor.addEventListener('raycaster-intersection', this.handleHover.bind(this));
       this.cursor.addEventListener('raycaster-intersection-cleared', this.handleHoverEnd.bind(this));
  },

  handleAddViewClick: function(e) {
    this.addView.removeEventListener('click', this.handleAddViewClick.bind(this));
    this.plus.removeEventListener('click', this.handlePlusClick.bind(this));
    this.cursor.removeEventListener('click', this.handleCursorClick.bind(this));
      console.log("click button");
      this.addRoom();
  },

  handleHover: function(evt) {
      if (evt.detail.els.includes(this.addView)) {
          this.cursor.setAttribute('material','opacity: 0.5');
      }
  },
  handleHoverEnd: function(evt) {
    if (!evt.detail.els) {
        this.cursor.setAttribute('material','opacity:1');
    }
},

handlePlusClick: function() {
    this.plus.remove();
    console.log("click");
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
    let buttonPos2 = calculateButtonPosition(-50); // Offset by -30 degrees

    this.addView.setAttribute('position', `${buttonPos1.x} ${buttonPos1.y} ${buttonPos1.z}`);
    this.addMarker.setAttribute('position', `${buttonPos2.x} ${buttonPos2.y} ${buttonPos2.z}`);
    this.addView.setAttribute('rotation', { x: 0, y: camRot, z: 0 });
    this.addMarker.setAttribute('rotation', { x: 0, y: camRot, z: 0 });
    this.addView.setAttribute('visible', true);
    this.addMarker.setAttribute('visible', true);
    this.el.setAttribute('geometry', {
        radiusOuter: 0.03
    });
},
  handleCursorClick: function() {
      let currentRadiusOuter = this.el.getAttribute('geometry').radiusOuter;

      if (this.isThick) {
          newRadiusOuter = 0.03;
          this.addView.setAttribute('visible', false);
          this.addMarker.setAttribute('visible',false);
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
  addRoom: function() {
    
    if (this.el.sceneEl.contains(this.addView && this.addMarker)) {
      let sky = document.querySelector('a-sky');
    this.el.sceneEl.removeChild(this.addView);
    this.el.sceneEl.removeChild(this.addMarker);
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
this.el.removeAttribute('toggle-thickness');
  return;
}

  }
});
