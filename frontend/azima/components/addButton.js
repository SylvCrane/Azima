
    const colorWheel = document.getElementById('colorWheel');

    colorWheel.addEventListener('input', function() {
      this.style.backgroundColor = this.value;
    });
