/**
 * points.js
 * Description: Manages the marking and capturing of points in the A-Frame scene for creating portals. Handles user interactions to draw points and form triangles, and listens for save and cancel events.
 */

AFRAME.registerComponent("markable", {
  init: function () {
    this.identifier = this.generateUniqueIdentifier();
    this.clickPositions = [];
    this.pointCounter = 0;
    this.newPoints = [];
    this.initPos = null;
    let release = null;
    this.maxPoints = 4;
    this.cursor = document.getElementById("cursorRing");

    /**
     * save Event Listener
     * Listens for the save event to save the current state by removing points and event listeners.
     */
    document.body.addEventListener("save", () => {
      this.save();
    });

    /**
     * cancel Event Listener
     * Listens for the cancel event to reset the current state by removing points and event listeners.
     */
    document.body.addEventListener("cancel", () => {
      this.cancel();
    });

    this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
    this.boundMouseUpHandler = this.mouseUpHandler.bind(this);

    /**
     * mousedown Event Listener
     * Listens for the mousedown event on the element to capture the initial position for drawing points.
     */
    this.el.addEventListener("mousedown", this.boundMouseDownHandler);

    /**
     * mouseup Event Listener
     * Listens for the mouseup event on the element to finalize the position and draw points if conditions are met.
     */
    this.el.addEventListener("mouseup", this.boundMouseUpHandler);

    /**
     * raycaster-intersection Event Listener
     * Listens for the raycaster intersection event on the cursor to highlight intersected points.
     */
    this.cursor.addEventListener("raycaster-intersection", (e) => {
      if (this.newPoints) {
        this.newPoints.forEach((point) => {
          if (e.detail.els.includes(point)) {
            point.setAttribute("material", "color:white");
          }
        });
      }
    });

    /**
     * raycaster-intersection-cleared Event Listener
     * Listens for the raycaster intersection cleared event on the cursor to reset the color of points.
     */
    this.cursor.addEventListener("raycaster-intersection-cleared", (e) => {
      if (this.newPoints) {
        this.newPoints.forEach((point) => {
          if (!e.detail.els) {
            point.setAttribute("material", "color: #0A7A68");
          }
        });
      }
    });
  },

  /**
   * draw()
   * Draws a new point at the captured initial position and appends it to the scene.
   * If the maximum number of points is reached, initializes the triangles.
   */
  draw: function () {
    console.log("[markable] Point captured at:", this.initPos);
    console.log(this.el);

    let scene = document.querySelector("a-scene");
    let newPoint = document.createElement("a-entity");

    newPoint.setAttribute("geometry", {
      primitive: "sphere",
      radius: 0.1,
    });
    newPoint.setAttribute("material", "color: #09483E");
    newPoint.setAttribute(
      "position",
      `${this.initPos.x} ${this.initPos.y} ${this.initPos.z}`
    );
    newPoint.setAttribute("id", this.pointCounter);

    newPoint.addEventListener("click", (event) => {
      this.erase(event.target);
    });

    this.clickPositions.push(this.initPos);
    this.newPoints.push(newPoint);
    scene.appendChild(newPoint);

    this.pointCounter++;

    if (this.pointCounter >= this.maxPoints) {
      this.initTriangles();
    }
  },

  /**
   * erase(point)
   * Erases the specified point from the scene and updates the internal state.
   * @param {HTMLElement} point - The point element to be removed.
   */
  erase: function (point) {
    const index = this.newPoints.indexOf(point);
    if (this.pointCounter === 4) {
      this.el.emit("fourPointsRemoved", { identifier: this.identifier });
    }

    if (index > -1) {
      this.newPoints.splice(index, 1);
      this.clickPositions.splice(index, 1);
      this.pointCounter--;
    }

    if (point && point.parentNode) {
      point.remove();
    }
  },

  /**
   * initTriangles()
   * Emits the fourPointsCaptured event with the captured positions to initialize the creation of triangles.
   */
  initTriangles: function () {
    console.log(
      "[markable] Emitting 'fourPointsCaptured' event with positions:",
      this.clickPositions,
      "and identifier:",
      this.identifier
    );
    this.el.emit("fourPointsCaptured", {
      positions: this.clickPositions,
      identifier: this.identifier,
    });
    console.log("[markable] Event 'fourPointsCaptured' emitted.");
  },

  /**
   * save()
   * Saves the current state by removing all points and event listeners.
   */
  save: function () {
    if (this.newPoints) {
      this.newPoints.forEach((point) => {
        point.remove();
      });

      this.pointCounter = 0;
      this.clickPositions = [];
      this.newPoints = [];
      this.el.removeAttribute("markable");
      this.el.removeEventListener("mousedown", this.boundMouseDownHandler);
      this.el.removeEventListener("mouseup", this.boundMouseUpHandler);
    }
  },

  /**
   * cancel()
   * Cancels the current operation by removing all points and resetting the state.
   */
  cancel: function () {
    console.log("cancel received");

    if (this.newPoints) {
      this.newPoints.forEach((point) => {
        point.remove();
      });
    }
    if (this.pointCounter === 4) {
      this.el.emit("fourPointsRemoved", { identifier: this.identifier });

      this.pointCounter = 0;
      this.clickPositions = [];
      this.newPoints = [];
    }
    this.el.removeEventListener("mousedown", this.boundMouseDownHandler);
    this.el.removeEventListener("mouseup", this.boundMouseUpHandler);
    this.el.removeAttribute("markable");
  },

  /**
   * mouseDownHandler(e)
   * Handles the mousedown event to capture the initial position for drawing points.
   * @param {Event} e - The event object from the mousedown event.
   */
  mouseDownHandler: function (e) {
    release = null;

    if (e.detail && e.detail.intersection) {
      this.initPos = e.detail.intersection.point;
    }
  },

  /**
   * mouseUpHandler(e)
   * Handles the mouseup event to finalize the position and draw points if conditions are met.
   * @param {Event} e - The event object from the mouseup event.
   */
  mouseUpHandler: function (e) {
    if (e.detail && e.detail.intersection) {
      release = e.detail.intersection.point;
    }

    if (this.initPos && release && release.equals(this.initPos)) {
      console.log(this.el);

      if (this.pointCounter < this.maxPoints) {
        console.log("draw");
        this.draw();
      }
    }
  },

  /**
   * generateUniqueIdentifier()
   * Generates a unique identifier for the component instance.
   * @returns {string} - A unique identifier string.
   */
  generateUniqueIdentifier: function () {
    return "id-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  },
});