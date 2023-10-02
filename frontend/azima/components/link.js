AFRAME.registerComponent('new-room', {
  schema: {
    url: { type: 'string' },
    texture: { type: 'string' },
    positions: { type: 'array' }
  },
 
  init: function () {

  this.triangles = null;
    document.addEventListener('fourPointsCaptured', (event) => {
      const positions = event.detail.positions;
      if (positions && positions.length >= 4) {
        this.createTriangles(positions);
      }
    });

    this.el.setAttribute('material','color:red');
    this.el.setAttribute('hoverable', '');

    this.el.addEventListener('hover-start', () => {
      this.hover(0.7);
    });

    this.el.addEventListener('hover-end', () => {
      this.hover(1);
    });

    this.el.addEventListener('click', () => {
      this.transition();
    });
    const colorWheel = document.getElementById('colorWheel');
    colorWheel.addEventListener('input', (event) => {
      this.changeColor(event.target.value);
    });


    const inputForm = document.getElementById('inputForm');

      inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const textInput = document.getElementById('textInput').value;
        console.log('Form submitted, text input:', textInput);
        this.addText(textInput);
      });
    },

    transition: function (){
      let scene = document.querySelector('a-sky');
      document.getElementById('overlay').style.opacity = '1';
      document.getElementById('overlay').style.zIndex = '1000';
      if (this.triangles) {
        this.triangles.forEach((triangle) => {
          triangle.setAttribute('position', `0 0 0 `);
        });
      }
      setTimeout(() => {
       scene.setAttribute('src', './assets/IMG_20230607_150934_00_118.jpg');
      }, 500);
    },

  hover: function(opacity) {
    if (this.triangles) {
      this.triangles.forEach((triangle) => {
        triangle.setAttribute('material', `opacity: ${opacity}`);
      });
    }
  },

  changeColor : function (color){
      if (this.triangles) {
        this.triangles.forEach((triangle) => {
          triangle.setAttribute('material', `color: ${color}`);
        });
      }

  },

  addText: function(text) {

    if (this.triangles) {
      let t = document.createElement('a-text');
      let position = this.el.getAttribute('position');
      
      t.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
      t.setAttribute('text', `value: ${text}`);
      this.el.appendChild(t);
    }
  },

  createTriangles: function (positions) {

    let m = document.createElement('a-triangle');
    let mb = document.createElement('a-triangle');
    let mt = document.createElement('a-triangle');
    let mtb = document.createElement('a-triangle');
    this.triangles = [m ,mb, mt, mtb];
    
    m.setAttribute('vertex-a', `${positions[0].x} ${positions[0].y} ${positions[0].z}`);
    m.setAttribute('vertex-b', `${positions[1].x} ${positions[1].y} ${positions[1].z}`);
    m.setAttribute('vertex-c', `${positions[2].x} ${positions[2].y} ${positions[2].z}`);
    mb.setAttribute('vertex-a', `${positions[2].x} ${positions[2].y} ${positions[2].z}`);
    mb.setAttribute('vertex-b', `${positions[1].x} ${positions[1].y} ${positions[1].z}`);
    mb.setAttribute('vertex-c', `${positions[0].x} ${positions[0].y} ${positions[0].z}`);
    mt.setAttribute('vertex-a', `${positions[2].x} ${positions[2].y} ${positions[2].z}`);
    mt.setAttribute('vertex-b', `${positions[3].x} ${positions[3].y} ${positions[3].z}`);
    mt.setAttribute('vertex-c', `${positions[0].x} ${positions[0].y} ${positions[0].z}`);
    mtb.setAttribute('vertex-a', `${positions[0].x} ${positions[0].y} ${positions[0].z}`);
    mtb.setAttribute('vertex-b', `${positions[3].x} ${positions[3].y} ${positions[3].z}`);
    mtb.setAttribute('vertex-c', `${positions[2].x} ${positions[2].y} ${positions[2].z}`);

    this.el.appendChild(mb);
    this.el.appendChild(mt);
    this.el.appendChild(mtb);
    this.el.appendChild(m);
  }
});