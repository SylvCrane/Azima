AFRAME.registerComponent('dynamic-cursor', {
    schema: {
      enabled: {default: true}
    },
  
    init: function() {
      this.el.sceneEl.addEventListener('loaded', () => {
        this.raycaster = this.el.components.raycaster.raycaster;
        this.camera = this.el.sceneEl.camera.el;
        this.lastColor = null;
        this.active = false; // Track if the cursor is moving
      });
      this.canvas = document.getElementById('hiddenCanvas');
      this.context = this.canvas.getContext('2d');
      console.log(this.context);
      this.addEventListeners();
    },
    
    addEventListeners: function() {
      // Listen for mouse move events to activate updates
      this.el.sceneEl.canvas.addEventListener('mousemove', () => {
        this.active = true;
      });

      // Optionally, add touchmove for mobile devices
      this.el.sceneEl.canvas.addEventListener('touchmove', () => {
        this.active = true;
      });

      // Reset activity state when mouse movement stops
      this.el.sceneEl.canvas.addEventListener('mouseleave', () => {
        this.active = false;
      });
    },
  
    tick: function() {
      if (!this.active || !this.raycaster || !this.camera || !this.data.enabled) {
        return; // Only process when active
      }

      const intersections = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true);
      if (intersections.length > 0 && intersections[0].object.el.nodeName.toLowerCase() === 'a-sky'&& intersections[0].object.el.nodeName!== null){
      
        const uv = intersections[0].uv;
   
        if (uv) {
          const imageX = Math.floor(uv.x * this.canvas.width);
          const imageY = Math.floor(uv.y * this.canvas.height);
          const color = this.getPixelColor(imageX, imageY);

          if (this.lastColor !== color) {
            const contrastingColor = this.getContrastingColor(color);
            this.updateCursorColor(contrastingColor);
            this.lastColor = color;
          }
        }
      }
      // Reset active state after processing to prevent continuous updates
      this.active = false;
    },
  
    getPixelColor: function(x, y) {
      const pixel = this.context.getImageData(x, y, 1, 1).data;
      return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    },
    getContrastingColor: function(rgb) {
        const color = rgb.match(/\d+/g);
        const r = parseInt(color[0]);
        const g = parseInt(color[1]);
        const b = parseInt(color[2]);
        // Calculate the perceptive luminance (ignoring gamma)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Adjust the threshold to better match expected behavior
        return luminance > 0.85 ? 'black' : 'white';  // Adjusted threshold from 0.5 to 0.6
      },
      
    updateCursorColor: function(color) {
      const cursorElement = this.el;
      cursorElement.setAttribute('material', 'color', color);

    }
});
