AFRAME.registerComponent('toggle-thickness', {
  init: function () {
    this.isThick = false;  // To track the current state
    this.el.addEventListener('click', () => {
      let currentRadiusOuter = this.el.getAttribute('geometry').radiusOuter;

      let newRadiusOuter;

      if (this.isThick) {
        // If the ring is already thick, set to original dimensions
        newRadiusOuter = 0.03;
      } else {
        // Make the ring thicker
        newRadiusOuter = currentRadiusOuter + 0.01;
      }

      this.el.setAttribute('geometry', {
        radiusOuter: newRadiusOuter
      });

      this.isThick = !this.isThick;  // Toggle the state
    });
  }
});
