import { savePhotos } from './savePhotos.js';



  console.log("customization")
 

document.addEventListener("edit", function () {
  const assetsContainer = document.querySelector("a-assets");
  const scrollContainer = document.getElementById("scroll-container");
  let imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  let caption = document.createElement('span');
  caption.className = 'caption';
  let asset = document.createElement("img");

 
  
  const photo = {
    name: '',
    image: '',
    imageTimeline: '',
  };


  
  

  const inputForm = document.querySelector(".inputForm");
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const textInput = document.getElementById("textInput").value;
    console.log("Form submitted, text input:", textInput);
    asset.id = textInput;
    caption.textContent = textInput;
    photo.name = textinput;
  });


  const fileForm = document.querySelector(".fileForm");
 
  const fileUpload = document.getElementById("file-upload");
  fileForm.addEventListener("click", function () {
    fileUpload.click(); // Trigger the hidden file input
  });

  // Optional: If you want to take action after a file is selected
  fileUpload.addEventListener("change", function () {
    if (fileUpload.files.length > 0) {
      console.log("File selected:", fileUpload.files[0].name);
    }
  });
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name");
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      fileNameDisplay.textContent = this.files[0].name;
      photo.image = this.files[0].name;
      photo.imageTimeline = 0;
      savePhotos(photo, "HouseID");
      
    } else {
      fileNameDisplay.textContent = "None";
    }
  });
  document.getElementById("saveButton").addEventListener("click", function () {
    let event = new Event("save");
    let sky = document.querySelector("a-sky");

    if (asset.id && asset.src) {
      document.body.dispatchEvent(event);
      assetsContainer.appendChild(asset);
      imageContainer.appendChild(asset);
      imageContainer.appendChild(caption);
      scrollContainer.appendChild(imageContainer);
      console.log("saved sent");
      console.log(assetsContainer);
      addImageToGallery('assets/your-image.jpg', 'NewImageId', 'New Image Caption');
      asset = document.createElement("img"); 
    } else {
      console.log("Asset id or src is not set");
    }
  });

});

