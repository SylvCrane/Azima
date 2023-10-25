const asset = document.createElement("img");
document.addEventListener("DOMContentLoaded", function () {
  const assetsContainer = document.querySelector("a-assets");

  const colorWheel = document.getElementById("colorWheel");
  let asset = document.createElement("img");
  // Change the background color of the container when the color wheel changes.
  colorWheel.addEventListener("input", function (event) {
    const selectedColor = event.target.value;
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
  document.getElementById("saveButton").addEventListener("click", function () {
    let event = new Event("save");
    let sky = document.querySelector("a-sky");

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
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name");
  const inputForm = document.querySelector(".inputForm");
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const textInput = document.getElementById("textInput").value;
    console.log("Form submitted, text input:", textInput);
    asset.id = textInput;
  });
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      fileNameDisplay.textContent = this.files[0].name;

      asset.src = `./assets/${fileNameDisplay.textContent}`;
    } else {
      fileNameDisplay.textContent = "None";
    }
  });
});
