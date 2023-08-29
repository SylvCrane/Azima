import 'aframe';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import SkyCity from "./images/SkyCity.jpg"
import Room from "./images/Room.jpg"

class App extends React.Component {
  
  changeScene() {
    var back = document.querySelector("#background");
    console.log(back);
    console.log(back.getAttribute('src'));
    
    if (back.getAttribute('src') === "#city")
    {
      back.setAttribute('src', "#room");
    }
    else
    {
      back.setAttribute('src', "#city");
    }
  }
  
  render () {
    return (
      <Scene>
        <a-assets>
          <img id="city" src={SkyCity}/>
          <img id="room" src={Room}/>
        </a-assets>
        
        <Entity id="background" primitive="a-sky" radius="50" height="865" width="1786" src="#room"/>
        <Entity id="box"
          geometry={{primitive: 'box'}}
          position={{x: 0, y: 1, z: -3}}
          events={{click: this.changeScene.bind(this)}}>

        </Entity>
          
        <Entity primitive="a-camera">
          <Entity primitive="a-cursor" animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}/>
        </Entity>
        
      </Scene>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));
