/**
 * loader.js
 * Description: Handles the loading and creation of window elements in the A-Frame scene. Listens for custom events to dynamically build and display windows based on received data.
 */

AFRAME.registerComponent("loader", {
  /**
   * init()
   * Initializes the loader component by setting up the element and adding event listeners.
   * Binds the buildWindow function to ensure it has the correct context when called.
   * Listens for loadWindows and createWindow events to handle the loading and creation of window elements.
   */
  init: function () {
    console.log("Loader component initialized.");
    console.log(this.el);
    this.buildWindow = this.buildWindow.bind(this);

    this.el.sceneEl.addEventListener("loadWindows", (event) => {
      console.log("Received loadWindows event id", event.detail.detail.id);
      console.log(this.el.getAttribute('id'));
      console.log("Event detail", event.detail.detail.data);
      if (this.el.getAttribute('id') === event.detail.detail.id) {
        this.buildWindow(JSON.stringify(event.detail.detail.data));
      }
    });

    this.el.sceneEl.addEventListener("createWindow", (event) => {
      console.log("Received createWindow event", event.detail);
      console.log(this.el);
      this.buildWindow(event.detail);
    });
  },

  /**
   * buildWindow(dataString)
   * Constructs the window elements based on the provided data string.
   * Parses the data, creates triangle and text elements, and appends them to the component's DOM.
   * Sets the necessary attributes on the element and removes the loader attribute after building the window.
   * @param {string} dataString - The JSON string containing the data for building the window.
   */
  buildWindow: function (dataString) {
    let data = JSON.parse(dataString);

    if (!this.el.getAttribute('window')) {
      data.triangles.forEach((triangleData) => {
        let triangleEl = document.createElement("a-triangle");
        triangleEl.setAttribute("vertex-a", triangleData.vertexA);
        triangleEl.setAttribute("vertex-b", triangleData.vertexB);
        triangleEl.setAttribute("vertex-c", triangleData.vertexC);
        triangleEl.setAttribute("material", `color: ${triangleData.color}`);
        this.el.appendChild(triangleEl);
      });

      data.textData.forEach((textInfo) => {
        let textEl = document.createElement("a-text");
        textEl.setAttribute("value", textInfo.value);
        textEl.setAttribute("position", textInfo.position);
        textEl.setAttribute("rotation", textInfo.rotation);
        textEl.setAttribute("width", "30");
        textEl.setAttribute("align", "center");
        textEl.setAttribute("font", "./assets/MazzardM-Regular-msdf.json");
        textEl.setAttribute("negate", "false");
        this.el.appendChild(textEl);
      });

      this.el.setAttribute("class", data.location);
      this.el.setAttribute("id", data.destination);
      this.el.setAttribute("window", '');
      this.el.setAttribute("position", `0 0 0`);
      this.el.removeAttribute("loader");
      this.remove();
      console.log("Loader attribute removed:", !this.el.hasAttribute("loader"));
    }
  },

  /**
   * remove()
   * Cleans up the loader component by removing event listeners.
   * Emits a load event with the component's class attribute.
   */
  remove: function () {
    this.el.emit('load', this.el.getAttribute('class'));
    this.el.sceneEl.removeEventListener("createWindow", this.buildWindow);
    this.el.sceneEl.removeEventListener("loadWindows", this.buildWindow);
    console.log('Event listeners removed');
  }
});