document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
  
    // Function to create a new form instance
    function createForm() {
      const formContainer = document.createElement('div');
      formContainer.classList.add("form-instance");
  
      formContainer.innerHTML = `
        <form class="inputForm">
          <h1>Room</h1>
          <input type="text" placeholder="Enter text">
        </form>
        <form class="fileForm">
          <label for="file-upload" class="custom-file-upload">Upload a 360° image:</label>
          <input id="file-upload" type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" style="display: none;">
          <p>Selected file: <span>None</span></p>
        </form>
        <button class="cancelButton">Remove</button>
      `;
  
      // Text input event listener
      const textInput = formContainer.querySelector('input[type="text"]');
      textInput.addEventListener('input', function() {
        console.log('Text input value:', this.value); // Or any other logic
      });
  
      // File input event listener
      const fileInput = formContainer.querySelector('input[type="file"]');
      const fileLabel = formContainer.querySelector('.custom-file-upload');
      const selectedFileText = formContainer.querySelector('p span');
  
     
      fileInput.addEventListener('change', function() {
        const fileName = this.files.length > 0 ? this.files[0].name : 'None';
        selectedFileText.textContent = fileName;
      });
  
      // Add event listener for the cancel button within this form
      const cancelButton = formContainer.querySelector('.cancelButton');
      cancelButton.addEventListener('click', () => {
        formContainer.remove(); // Removes this form instance
      });
  
      return formContainer;
    }
  
    // Function to add a new form when "Add Room" button is clicked
    addButton.addEventListener('click', () => {
      const newForm = createForm();
      document.querySelector('.forms-container').appendChild(newForm);
    });
  });
  