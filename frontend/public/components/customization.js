



document.addEventListener("edit", function () {
  const assetsContainer = document.querySelector("a-assets");
  const scrollContainer = document.getElementById("scroll-container");
  let imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  let caption = document.createElement('span');
  caption.className = 'caption';
  let asset = document.createElement("img");
  let select = document.getElementById("scroll");
  let selected;
  // Change the background color of the container when the color wheel changes.
 
 
  

  
  

  select.addEventListener("click",function (e){
    let img = e.target.closest(".image-container");
    
    
    
    
   
        
    
    
   
  
        image = img.children[0];
        asset.src = image.src.replace("http://127.0.0.1:62523", "");
        caption = img.children[1];
        asset.id = caption.innerText;
        selected = img
        
  });

  
  document.getElementById("saveButton").addEventListener("click", function () {
    let event = new Event("save");
    let sky = document.querySelector("a-sky");
    let tab = document.getElementById('tab');
    if (asset.id && asset.src) {
      document.body.dispatchEvent(event);
      assetsContainer.appendChild(asset);
      console.log(assetsContainer);
      console.log("saved sent");
      console.log(asset.src);
      tab.style.display ='';
      asset = document.createElement("img"); 
    } else {
      console.log("Asset id or src is not set");
    }
  });
  document.getElementById("cancelButton").addEventListener("click", function () {
    let tab = document.getElementById('tab');
    let event = new Event("cancel");
    tab.style.display ='';
    document.body.dispatchEvent(event);
  });

});

