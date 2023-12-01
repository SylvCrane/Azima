const asset = document.createElement("img");
document.addEventListener("DOMContentLoaded", function () {
  const assetsContainer = document.querySelector("a-assets");



  let asset = document.createElement("img");
  // Change the background color of the container when the color wheel changes.

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
  document.getElementById("saveButton").addEventListener("click", function () {
    let event = new Event("save");
    let sky = document.querySelector("a-sky");
    const inputForm = document.querySelector(".inputForm");
    const textInput = document.getElementById("textInput").value;
    asset.id = textInput;
    if (asset.id && asset.src) {
      document.body.dispatchEvent(event);
      assetsContainer.appendChild(asset);
      console.log("saved sent");
      console.log(assetsContainer);
      asset = document.createElement("img"); // Reset asset for the next save
    } else {
      console.log("Asset id or src is not set");
    }
  });
  document.getElementById("cancelButton").addEventListener("click", function () {
    let event = new Event("cancel");
    document.body.dispatchEvent(event);
    console.log("cancel sent");
  });
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name");
 

  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      fileNameDisplay.textContent = this.files[0].name;

      asset.src = `./assets/${fileNameDisplay.textContent}`;
    } else {
      fileNameDisplay.textContent = "None";
    }
  });
});
