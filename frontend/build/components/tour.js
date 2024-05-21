AFRAME.registerComponent('toggle-tutorial', {

    init: function () {
        this.instructionText = document.createElement('div');
        this.createInstructionalText();
        // Set up inactivity timeout
        this.setupInactivityTimeout();
    },
    createInstructionalText: function() {
        this.instructionText.innerText = 'Click and drag on the screen to look around.';
        this.instructionText.style.position = 'fixed';
        this.instructionText.style.top = '65%';
        this.instructionText.style.left = '50%';
        this.instructionText.style.transform = 'translateX(-50%)';
        this.instructionText.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        this.instructionText.style.color = '#fff';
        this.instructionText.style.padding = '10px 20px';
        this.instructionText.style.borderRadius = '5px';
        this.instructionText.style.zIndex = '1000';
        this.instructionText.style.fontFamily = 'Rubik, sans-serif';
        this.instructionText.style.fontSize = '16px';
        this.instructionText.style.textAlign = 'center';
        this.instructionText.style.display = 'none'; // Initially hide the instructional text
    
        // Append the instructional text to the body if on the A-Frame page
        document.body.appendChild(this.instructionText);
      },
    
      showInstructionText: function() {
        if (this.instructionText) {
          this.instructionText.style.display = 'block';
        }
    },
    hideInstructionText: function() {
        if (this.instructionText) {
          this.instructionText.style.display = 'none';
        }
    },
    
    setupInactivityTimeout: function() {
        let inactivityTimeout;
        
        const showInstructionText = () => {
          if (this.instructionText) {
            this.instructionText.style.display = 'block';
          }
        };
      
        const resetInactivityTimeout = () => {
          if (this.instructionText) {
            this.instructionText.style.display = 'none';
          }
          clearTimeout(inactivityTimeout);
          inactivityTimeout = setTimeout(showInstructionText, 5000);
        };
      
        // Set initial timeout
        inactivityTimeout = setTimeout(showInstructionText, 5000);
      
        // Add event listeners for user activity
        ['click', 'keydown', 'scroll'].forEach(event => {
          document.addEventListener(event, resetInactivityTimeout);
        });
      },
    


});