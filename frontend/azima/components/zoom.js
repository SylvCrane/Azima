// fovZoomControl.js

AFRAME.registerComponent('fov-zoom-control', {
    schema: {
      zoomStep: {default: 1},  // How much to adjust the fov for each "zoom" step
      maxZoom: {default: 80},  // Maximum fov you can zoom out to
      minZoom: {default: 20}   // Minimum fov you can zoom in to
    },
    
    init: function () {
      this.zoomIn = this.zoomIn.bind(this);
      this.zoomOut = this.zoomOut.bind(this);
  
      // Listen for wheel events on the canvas element
      this.el.sceneEl.canvas.addEventListener('wheel', (event) => {
        if (event.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      });
    },
    
    zoomIn: function () {
      let currentFov = this.el.getAttribute('camera').fov;
      if (currentFov <= this.data.minZoom) return;  // Don't zoom past the minimum
      this.el.setAttribute('camera', 'fov', currentFov - this.data.zoomStep);
    },
  
    zoomOut: function () {
      let currentFov = this.el.getAttribute('camera').fov;
      if (currentFov >= this.data.maxZoom) return;  // Don't zoom past the maximum
      this.el.setAttribute('camera', 'fov', currentFov + this.data.zoomStep);
    }
  });
  