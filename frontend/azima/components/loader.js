AFRAME.registerComponent("loader", {
  init: function () {
    console.log("Loader component initialized.");
    console.log(this.el);
    this.buildWindow = this.buildWindow.bind(this);
   
    this.el.sceneEl.addEventListener("loadWindows", (event) => {
      console.log("Received loadWindows event id", event.detail.detail.id );
      console.log(this.el.getAttribute('id'));
      console.log("Event detail", event.detail.detail.data);
      if(this.el.getAttribute('id')=== event.detail.detail.id){
      this.buildWindow(JSON.stringify(event.detail.detail.data));

      }
      
    });
    this.el.sceneEl.addEventListener("createWindow", (event) => {
      console.log("Received createWindow event", event.detail);
      console.log(this.el);
      this.buildWindow(event.detail);

      
      
    });

     
    

    
  },
  buildWindow: function (dataString ) {
    let data = JSON.parse(dataString);
    





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
      textEl.setAttribute("width", "30");
      textEl.setAttribute("align", "center");
      this.el.appendChild(textEl);
    });

    // Set class and ID from data
    this.el.setAttribute("class", data.location);
    this.el.setAttribute("id", data.destination);
    
    this.el.setAttribute("window", '');

    this.el.removeAttribute("loader");
    this.remove();
    console.log("Loader attribute removed:", !this.el.hasAttribute("loader"));


    
  }
  },
  remove: function() {
    document.dispatchEvent(new Event("load"));
    this.el.sceneEl.removeEventListener("createWindow", this.buildWindow);
    this.el.sceneEl.removeEventListener("loadWindows", this.buildWindow);
    console.log('Event listeners removed');
  }
});
