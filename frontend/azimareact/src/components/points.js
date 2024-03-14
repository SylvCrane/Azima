import React, {useEffect, useState} from 'react';
import { AFRAME } from 'aframe';

const Points = () => {
  useEffect(() => {
    if (AFRAME && AFRAME.components && !AFRAME.components['markable'])
    {
      AFRAME.registerComponent('markable', {

        init: function () {
          this.identifier = this.generateUniqueIdentifier(); 
          this.clickPositions = [];
          this.pointCounter = 0;
          this.newPoints = [];
          this.initPos = null;
          let release = null;
          this.cursor = document.getElementById('cursorRing');
      
          document.body.addEventListener('save',()=>{
            this.save();
            this.remove();
          })
      
          this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
          this.boundMouseUpHandler = this.mouseUpHandler.bind(this);
      
          this.el.addEventListener('mousedown', this.boundMouseDownHandler);
          this.el.addEventListener('mouseup', this.boundMouseUpHandler);
      
            if (this.initPos &&release && release.equals(this.initPos)) {
              console.log("draw");
              this.draw();  
            } else {
             
            }
          } ,
        
        
        
        draw : function () {
          const maxPoints = 4;
          if (this.pointCounter < maxPoints) {
            console.log("[markable] Point captured at:", this.initPos);
            console.log(this.el);
            let scene = document.querySelector('a-scene');
            let newPoint = document.createElement('a-entity');
          
            newPoint.setAttribute('geometry', {
              primitive: 'sphere',
              radius: 0.1,
            });
            newPoint.setAttribute('material', 'color:red');
            newPoint.setAttribute('position', `${this.initPos.x} ${this.initPos.y} ${this.initPos.z}`);
      
            this.clickPositions.push(this.initPos);
            this.newPoints.push(newPoint);
            scene.appendChild(newPoint);
            this.cursor.addEventListener('raycaster-intersection', (e)=>{
              if (this.newPoints) {
                this.newPoints.forEach((point) => {
                  if (e.detail.els.includes(point)){
                    point.setAttribute('material','color:white');
                  }
                });
              }
            });
            this.cursor.addEventListener('raycaster-intersection-cleared', (e)=>{
              if (this.newPoints) {
                this.newPoints.forEach((point) => {
                  if (!e.detail.els){
                    point.setAttribute('material','color:red');
                  }
                });
              }
            });
            
            
            this.pointCounter++;
          }
          if (this.pointCounter >= maxPoints) {
           this.initTriangles();
          }
        },
        initTriangles: function() {
          console.log("[markable] Emitting 'fourPointsCaptured' event with positions:", this.clickPositions, "and identifier:", this.identifier);
          this.el.emit('fourPointsCaptured', { positions: this.clickPositions, identifier: this.identifier });
          console.log("[markable] Event 'fourPointsCaptured' emitted.");
          this.clickPositions = [];
        },
        save : function(){
          console.log("saved recieved");
          let scene = document.querySelector('a-scene');
            console.log(this.el);
            console.log("save event triggered");
            console.log("this.newPoints:", this.newPoints);
            console.log("this.pointCounter", this.pointCounter);
            if (this.newPoints) {
              this.newPoints.forEach((point) => {
               
                
                point.remove();
               
             });
             this.newPoints=[];
           }
            
           
      
      
            
            this.pointCounter=0;
            this.el.removeAttribute('markable');
            console.log("this.newPoints:", this.newPoints);
            console.log("this.pointCounter", this.pointCounter);
        },
        remove: function () {
          console.log('remove');
          this.el.removeEventListener('mousedown', this.boundMouseDownHandler);
          this.el.removeEventListener('mouseup', this.boundMouseUpHandler);
      },
      mouseDownHandler: function(e) {
        release = null;
        if (e.detail && e.detail.intersection) {
          this.initPos = e.detail.intersection.point;
          console.log("[markable] mouse down at:", this.initPos);
          console.log("[markable] mouse up at:", release);
      }
      },
      
      
      mouseUpHandler: function(e) {
        if (e.detail && e.detail.intersection) {
         
            release = e.detail.intersection.point;
            console.log("[markable] mouse down at:", this.initPos);
            console.log("[markable] mouse up at:", release);
      
          }
            
          if (this.initPos &&release && release.equals(this.initPos)) {
            console.log("draw");
            this.draw();  
          } else {
           
          
      }
      },
      
      generateUniqueIdentifier: function() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      },
      
      });
    }
  }, []);

  return null;
}

export default Points;

// AFRAME.registerComponent('markable', {

//   init: function () {
//     this.identifier = this.generateUniqueIdentifier(); 
//     this.clickPositions = [];
//     this.pointCounter = 0;
//     this.newPoints = [];
//     this.initPos = null;
//     let release = null;
//     this.cursor = document.getElementById('cursorRing');

//     document.body.addEventListener('save',()=>{
//       this.save();
//       this.remove();
//     })

//     this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
//     this.boundMouseUpHandler = this.mouseUpHandler.bind(this);

//     this.el.addEventListener('mousedown', this.boundMouseDownHandler);
//     this.el.addEventListener('mouseup', this.boundMouseUpHandler);

//       if (this.initPos &&release && release.equals(this.initPos)) {
//         console.log("draw");
//         this.draw();  
//       } else {
       
//       }
//     } ,
  
  
  
//   draw : function () {
//     const maxPoints = 4;
//     if (this.pointCounter < maxPoints) {
//       console.log("[markable] Point captured at:", this.initPos);
//       console.log(this.el);
//       let scene = document.querySelector('a-scene');
//       let newPoint = document.createElement('a-entity');
    
//       newPoint.setAttribute('geometry', {
//         primitive: 'sphere',
//         radius: 0.1,
//       });
//       newPoint.setAttribute('material', 'color:red');
//       newPoint.setAttribute('position', `${this.initPos.x} ${this.initPos.y} ${this.initPos.z}`);

//       this.clickPositions.push(this.initPos);
//       this.newPoints.push(newPoint);
//       scene.appendChild(newPoint);
//       this.cursor.addEventListener('raycaster-intersection', (e)=>{
//         if (this.newPoints) {
//           this.newPoints.forEach((point) => {
//             if (e.detail.els.includes(point)){
//               point.setAttribute('material','color:white');
//             }
//           });
//         }
//       });
//       this.cursor.addEventListener('raycaster-intersection-cleared', (e)=>{
//         if (this.newPoints) {
//           this.newPoints.forEach((point) => {
//             if (!e.detail.els){
//               point.setAttribute('material','color:red');
//             }
//           });
//         }
//       });
      
      
//       this.pointCounter++;
//     }
//     if (this.pointCounter >= maxPoints) {
//      this.initTriangles();
//     }
//   },
//   initTriangles: function() {
//     console.log("[markable] Emitting 'fourPointsCaptured' event with positions:", this.clickPositions, "and identifier:", this.identifier);
//     this.el.emit('fourPointsCaptured', { positions: this.clickPositions, identifier: this.identifier });
//     console.log("[markable] Event 'fourPointsCaptured' emitted.");
//     this.clickPositions = [];
//   },
//   save : function(){
//     console.log("saved recieved");
//     let scene = document.querySelector('a-scene');
//       console.log(this.el);
//       console.log("save event triggered");
//       console.log("this.newPoints:", this.newPoints);
//       console.log("this.pointCounter", this.pointCounter);
//       if (this.newPoints) {
//         this.newPoints.forEach((point) => {
         
          
//           point.remove();
         
//        });
//        this.newPoints=[];
//      }
      
     


      
//       this.pointCounter=0;
//       this.el.removeAttribute('markable');
//       console.log("this.newPoints:", this.newPoints);
//       console.log("this.pointCounter", this.pointCounter);
//   },
//   remove: function () {
//     console.log('remove');
//     this.el.removeEventListener('mousedown', this.boundMouseDownHandler);
//     this.el.removeEventListener('mouseup', this.boundMouseUpHandler);
// },
// mouseDownHandler: function(e) {
//   release = null;
//   if (e.detail && e.detail.intersection) {
//     this.initPos = e.detail.intersection.point;
//     console.log("[markable] mouse down at:", this.initPos);
//     console.log("[markable] mouse up at:", release);
// }
// },


// mouseUpHandler: function(e) {
//   if (e.detail && e.detail.intersection) {
   
//       release = e.detail.intersection.point;
//       console.log("[markable] mouse down at:", this.initPos);
//       console.log("[markable] mouse up at:", release);

//     }
      
//     if (this.initPos &&release && release.equals(this.initPos)) {
//       console.log("draw");
//       this.draw();  
//     } else {
     
    
// }
// },

// generateUniqueIdentifier: function() {
//   return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
// },

// });
  

