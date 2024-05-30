/**
 * window.js
 * Description: Manages the portal window interactions in the Azima platform. Handles user interactions to switch scenes, hover effects, and scene loading based on user actions.
 */

AFRAME.registerComponent("window", {
  init: function () {
    console.log("init function called");
    console.log(this.el);
    this.delete = document.createElement("a-entity");
    this.delete.setAttribute("geometry", "primitive: circle; radius:0.25");
    this.delete.setAttribute("material", "color: #4ABFAA");
    this.delete.setAttribute("material", "opacity:0.8");
    this.delete.setAttribute(
      "text",
      "value:Remove Portal; align: center; width: 3"
    );
    this.delete.setAttribute("visible", false);
    this.el.sceneEl.appendChild(this.delete);

    this.cursor = document.getElementById("cursorRing");

    /**
     * raycaster-intersection Event Listener (cursor)
     * Listens for the raycaster intersection event on the cursor to handle hover effects on the portal.
     */
    this.cursor.addEventListener(
      "raycaster-intersection",
      this.hover.bind(this)
    );

    /**
     * raycaster-intersection-cleared Event Listener (cursor)
     * Listens for the raycaster intersection cleared event on the cursor to reset the hover effects on the portal.
     */
    this.cursor.addEventListener(
      "raycaster-intersection-cleared",
      this.hoverEnd.bind(this)
    );

    /**
     * click Event Listener (portal)
     * Listens for click events on the portal to handle the scene change with a fade effect.
     */
    this.el.addEventListener("click", () => {
      let overlay = document.getElementById('overlay');
      let sidebar = document.getElementById('portal-sidebar');
      if (sidebar) {
        sidebar.style.display = 'none';
      }
      overlay.style.transition = 'opacity 0.5s';
      overlay.style.opacity = '1';
      overlay.style.zIndex = '1000';

      setTimeout(() => {
        let id = this.el.getAttribute("id");
        console.log(id);
        let className = this.el.getAttribute("class");
        console.log(className);
        let current = document.getElementsByClassName(className);
        console.log(current);
        let next = document.getElementsByClassName(id);
        console.log(next);
        let sky = document.getElementById(id);

        if (current) {
          for (let c of current) {
            console.log("pushing: ", c, "position: ", c.getAttribute("position"));
            if (c.tagName.toLowerCase() === "a-entity") {
              this.push(c);
            }
          }
        }
        if (next) {
          for (let n of next) {
            console.log("pulling: ", n, "position: ", n.getAttribute("position"));
            if (n.tagName.toLowerCase() === "a-entity") {
              this.pull(n);
            }
          }
        }
        console.log(sky.id);
        this.load(sky.id);
        overlay.style.transition = 'opacity 1s';
        overlay.style.opacity = '0';
        overlay.addEventListener('transitionend', () => {
          overlay.style.zIndex = '-1';
          console.log("Fade-out complete. Finalizing scene change.");
        }, { once: true });

      }, 500);
    });

    /**
     * move Event Listener (document)
     * Listens for move events to handle portal movements and visibility based on the scene state.
     */
    document.addEventListener("move", (e) => {
      let sky = document.querySelector("a-sky");
      let className = sky.getAttribute("class");
      let sidebar = document.getElementById('portal-sidebar');
      if (sidebar) {
        sidebar.style.display = 'none';
      }
      if (this.el.getAttribute("class") === e.detail.id) {
        this.pull(this.el);
      } else if (this.el.getAttribute("id") === e.detail.id) {
        this.push(this.el);
      } else {
        this.push(this.el);
      }
      document.removeEventListener("move", (e));
    });

    /**
     * load Event Listener (portal)
     * Listens for load events to adjust the position of the portal based on its class attribute.
     */
    this.el.addEventListener("load", (e) => {
      console.log("load received");
      let room = document.querySelector('a-sky');
      let className = room.getAttribute("class");
      if (e.target.getAttribute('class') === className) {
        this.pull(e.target);
      } else {
        this.push(e.target);
      }
    });
  },

  /**
   * hoverEnd(e)
   * Handles the end of the hover event by resetting the opacity of the portal's triangles.
   * @param {Event} e - The event object from the raycaster intersection cleared.
   */
  hoverEnd: function (e) {
    let clearedEl = e.detail.clearedEls[0];
    if (clearedEl.parentNode === this.el) {
      let triangles = this.el.querySelectorAll("a-triangle");
      triangles.forEach((triangle) => {
        triangle.setAttribute("material", "opacity: 0.3");
      });
    }
  },

  /**
   * hover(e)
   * Handles the hover event by increasing the opacity of the portal's triangles.
   * @param {Event} e - The event object from the raycaster intersection.
   */
  hover: function (e) {
    let intersectedEl = e.detail.els[0];
    if (intersectedEl.parentNode === this.el) {
      let triangles = this.el.querySelectorAll("a-triangle");
      triangles.forEach((triangle) => {
        triangle.setAttribute("material", "opacity: 0.7");
      });
    }
  },

  /**
   * calcOffset(target)
   * Calculates the midpoint of the vertices of the portal's triangles.
   * @param {HTMLElement} target - The target element whose vertices are to be calculated.
   * @returns {Object} - The calculated midpoint with x, y, and z coordinates.
   */
  calcOffset: function (target) {
    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;
    let vertexCount = 0;

    let triangles = target.querySelectorAll("a-triangle");
    triangles.forEach((triangle) => {
      ["vertex-a", "vertex-b", "vertex-c"].forEach((vertexAttribute) => {
        let vertex = triangle.getAttribute(vertexAttribute);
        if (vertex) {
          let [x, y, z] = vertex.split(" ").map(Number);
          totalX += x;
          totalY += y;
          totalZ += z;
          vertexCount += 1;
        }
      });
    });

    let midpoint = {
      x: totalX / vertexCount,
      y: totalY / vertexCount,
      z: totalZ / vertexCount,
    };
    return midpoint;
  },

  /**
   * push(target)
   * Adjusts the position of the portal by pushing it to its calculated midpoint.
   * @param {HTMLElement} target - The target element to be pushed.
   */
  push: function (target) {
    let midpoint = this.calcOffset(target);
    target.setAttribute(
      "position",
      `${midpoint.x} ${midpoint.y} ${midpoint.z}`
    );
    console.log("pushed: ", target, "position: ", target.getAttribute("position"));
  },

  /**
   * pull(target)
   * Resets the position of the portal to the origin.
   * @param {HTMLElement} target - The target element to be pulled.
   */
  pull: function (target) {
    target.setAttribute("position", `0 0 0`);
    console.log("pulled: ", target, "position: ", target.getAttribute("position"));
  },

  /**
   * load(id)
   * Loads the specified image and updates the sky element with the new image.
   * @param {string} id - The ID of the image to load.
   */
  load: function (id) {
    console.log("ID:", id);
    let assets = document.querySelector('a-assets');
    let images = assets.querySelectorAll('img');

    images.forEach((img) => {
      if (img.id === id) {
        let sky = document.querySelector("a-sky");
        let canvas = document.getElementById("hiddenCanvas");
        let context = canvas.getContext('2d');
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = img.src;
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height / 1.2;
          context.drawImage(image, 0, 0);
        };
        sky.setAttribute("src", img.src);
        sky.setAttribute("class", img.id);
        console.log("Class after:", sky.className);
      }
    });
  }
});