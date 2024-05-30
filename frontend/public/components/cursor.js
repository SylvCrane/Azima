/**
 * cursor.js
 * Description: Manages the dynamic cursor behavior in the A-Frame scene, including raycasting and color updates based on cursor intersections.
 */

// Register the A-Frame component 'dynamic-cursor'
AFRAME.registerComponent('dynamic-cursor', {
  schema: {
      enabled: {default: true}
  },

  /**
   * init()
   * Initializes the dynamic-cursor component.
   * Sets up event listeners to track when the scene is loaded and initializes the raycaster and camera references.
   * Also prepares a hidden canvas element for color detection and binds event listeners for cursor movement.
   */
  init: function() {
      this.el.sceneEl.addEventListener('loaded', () => {
          this.raycaster = this.el.components.raycaster.raycaster;
          this.camera = this.el.sceneEl.camera.el;
          this.lastColor = null;
          this.active = false; // Track if the cursor is moving
      });
      this.canvas = document.getElementById('hiddenCanvas');
      this.context = this.canvas.getContext('2d');
      this.addEventListeners();
  },

  /**
   * addEventListeners()
   * Adds event listeners for mouse and touch movement to activate cursor updates.
   * Tracks cursor movement and resets activity state when movement stops.
   */
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

  /**
   * tick()
   * Updates the cursor color based on its intersection with the scene.
   * Uses raycasting to detect intersections and changes the cursor color based on the detected pixel color.
   */
  tick: function() {
      if (!this.active || !this.raycaster || !this.camera || !this.data.enabled) {
          return; // Only process when active
      }

      const intersections = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true);
      if (intersections.length > 0 && intersections[0].object.el.nodeName.toLowerCase() === 'a-sky' && intersections[0].object.el.nodeName !== null) {
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

  /**
   * getPixelColor(x, y)
   * Retrieves the color of a pixel at the specified coordinates from the hidden canvas.
   * Returns the color as an RGB string.
   */
  getPixelColor: function(x, y) {
      const pixel = this.context.getImageData(x, y, 1, 1).data;
      return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  },

  /**
   * getContrastingColor(rgb)
   * Calculates a contrasting color for the given RGB value.
   * Determines the luminance and returns either black or white based on the brightness.
   */
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

  /**
   * updateCursorColor(color)
   * Updates the cursor element's color based on the provided value.
   */
  updateCursorColor: function(color) {
      const cursorElement = this.el;
      cursorElement.setAttribute('material', 'color', color);
  }
});