import React, { useState, useEffect } from 'react';
import axios, {AxiosHeaders} from 'axios';
import { Link } from 'react-router-dom';
import image from '../assets/IMG_20231018_161144_00_742.jpg';
import Cursor from './cursor';
import Window from './window';
import Points from './points';

function Main() {

  useEffect (() => {
    const overlay = document.getElementById('overlay');

    overlay.style.opacity = '1';

    const handleTransitionEnd = () => {
      overlay.style.zIndex = '0';
    };

    overlay.addEventListener('transitionend', handleTransitionEnd);

    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 500);
    
  }, []);

    return (
      <div>
        <div className="color-picker-container">
          <h1>Pick a color:</h1>
          <input type="color" id="colorWheel" name="colorWheel" value="#ffffff" style={{ borderRadius: '300px' }} />
        </div>
        <form className="inputForm">
          <h1>View name:</h1>
          <input type="text" id="textInput" placeholder="Enter text" />
          <input type="submit" value="Submit" />
        </form>
        <form className="fileForm">
          <h1>Upload a 360° image:</h1>
          <input id="file-upload" type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" name="filename" />
          <p>Selected file: <span id="file-name">None</span></p>
        </form>
        <button id="saveButton">Save</button>
        <div id="overlay"></div>
        <div id="aframe-container">
          <a-scene>
          <Cursor />
          <Window />
          <Points />
            <a-assets>
            </a-assets>
            <a-entity camera="active:true" wasd-controls="active:true" look-controls="active:true" position="0 0 0">
              {/* Cursor Entity */}
              <a-entity id="cursorRing"
                        position="0 0 -1"
                        geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                        material="color: white; shader: flat"
                        cursor="rayOrigin: entity;"
                        raycaster="far: 10; showLine: true; lineColor: red; lineOpacity: 1"
                        super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent: raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
                        toggle-thickness>
              </a-entity>
            </a-entity>
            <a-sky className="Entrance" src={image} rotation="3 180 0" radius="20"></a-sky>
          </a-scene>
        </div>
      </div>
    );
  }

  export default Main;
                
