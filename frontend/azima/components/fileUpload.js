
document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    let src = ''; // Define src at a higher scope
    let name = ''; 
    // Function to create a new form instance
    function createForm() {
        const formContainer = document.createElement('div');
        formContainer.classList.add("form-instance");
  
        // Use unique IDs to ensure every form element is properly associated
        const uniqueId = Date.now(); // Simple way to get a unique ID
  
        formContainer.innerHTML = `
            <form class="inputForm">
                <h1>Room</h1>
                <input type="text" placeholder="Enter text">
            </form>
            <div class="file-upload-container" style="padding: 20px; border: 2px dashed #ccc; cursor: pointer; text-align: center;">
                <label for="file-upload-${uniqueId}" class="custom-file-upload">Upload a 360° image:</label>
                <input id="file-upload-${uniqueId}" type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" style="display: none;">
                <p>Selected file: <span>None</span></p>
            </div>
            <button class="cancelButton">Remove</button>
        `;
  

        const textInput = formContainer.querySelector('input[type="text"]');
        textInput.addEventListener('input', function() {
          

        name = this.value;
        console.log('this.name', this.name);
        });

        const fileUpload = formContainer.querySelector(`#file-upload-${uniqueId}`);
        const fileUploadContainer = formContainer.querySelector('.file-upload-container');
  
        fileUploadContainer.addEventListener('click', function () {
            fileUpload.click(); 
        });
  
        fileUpload.addEventListener('change', function () {
            const fileNameDisplay = formContainer.querySelector('p span');
            fileNameDisplay.textContent = this.files.length > 0 ? this.files[0].name : 'None';
            src = this.files[0].name;
            console.log("this.src" ,this.src);
        });
  
        // Cancel button functionality
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
   

        saveButton.addEventListener('click', function() {
            
            console.log('Save button clicked.');
            console.log(src);
            console.log(name);


        });
});
