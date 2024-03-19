import React from "react";
import "../../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 







export const AFrame = () => {
    return (

        
<div className="editor-page" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
           
           <iframe src={`${process.env.PUBLIC_URL}/azima.html`} title="Azima"  style={{
    border: 'none',
    width: '100%',
    height: '100%',
    overflow: 'hidden' // Add this line
  }}></iframe>

        </div>
           
  
    );
}