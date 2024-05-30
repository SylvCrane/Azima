/**
 * zoom.js
 * Description: Manages the field of view (fov) zoom control in the Azima platform. Allows users to zoom in and out within defined limits using the mouse wheel.
 */

AFRAME.registerComponent("fov-zoom-control", {
  schema: {
    zoomStep: { default: 1 }, // How much to adjust the fov for each "zoom" step
    maxZoom: { default: 80 }, // Maximum fov you can zoom out to
    minZoom: { default: 20 }, // Minimum fov you can zoom in to
  },

  init: function () {
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);

    /**
     * wheel Event Listener (canvas)
     * Listens for wheel events on the canvas element to handle zooming in and out based on the scroll direction.
     */
    this.el.sceneEl.canvas.addEventListener("wheel", (event) => {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
  },

  /**
   * zoomIn()
   * Zooms in by decreasing the field of view (fov) within the defined minimum zoom limit.
   */
  zoomIn: function () {
    let currentFov = this.el.getAttribute("camera").fov;
    if (currentFov <= this.data.minZoom) return; // Don't zoom past the minimum
    this.el.setAttribute("camera", "fov", currentFov - this.data.zoomStep);
  },

  /**
   * zoomOut()
   * Zooms out by increasing the field of view (fov) within the defined maximum zoom limit.
   */
  zoomOut: function () {
    let currentFov = this.el.getAttribute("camera").fov;
    if (currentFov >= this.data.maxZoom) return; // Don't zoom past the maximum
    this.el.setAttribute("camera", "fov", currentFov + this.data.zoomStep);
  },
});