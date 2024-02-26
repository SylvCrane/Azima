AFRAME.registerComponent("loader", {
  init: function () {
    console.log("Loader component initialized.");
    console.log(this.el);
    this.el.sceneEl.addEventListener("createWindow", (event) => {
      console.log("Received createWindow event", event.detail);
      console.log(this.el);
      this.buildWindow(event.detail);

      
      
    });
  },
  buildWindow: function (dataString ) {
    let data = JSON.parse(dataString);
    console.log(dataString);
    console.log("Building window with data:", data);


if(!this.el.getAttribute('window')){
    data.triangles.forEach((triangleData) => {
      let triangleEl = document.createElement("a-triangle");
      triangleEl.setAttribute("vertex-a", triangleData.vertexA);
      triangleEl.setAttribute("vertex-b", triangleData.vertexB);
      triangleEl.setAttribute("vertex-c", triangleData.vertexC);
      triangleEl.setAttribute("material", `color: ${triangleData.color}`);
      this.el.appendChild(triangleEl);
    });

    // Create and add text elements
    data.textData.forEach((textInfo) => {
      let textEl = document.createElement("a-text");
      textEl.setAttribute("value", textInfo.value);
      textEl.setAttribute("position", textInfo.position);
      textEl.setAttribute("rotation", textInfo.rotation);
      textEl.setAttribute("width", textInfo.width);
      textEl.setAttribute("align", textInfo.align);
      this.el.appendChild(textEl);
    });

    // Set class and ID from data
    this.el.setAttribute("class", data.class);
    this.el.setAttribute("id", data.id);
    
    this.el.setAttribute("window", '');

    this.el.removeAttribute("loader");
    this.remove();
    console.log("Loader attribute removed:", !this.el.hasAttribute("loader"));


    
  }
  },
  remove: function(){
    this.el.sceneEl.removeEventListener("createWindow", this.buildWindow);
    console.log('createWindow listener removed')
  }
});
