import React from "react";
import "../../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 

import RoomContainer from "../fileUpload/RoomContainer.js";
/*import RoomForm from "../fileUpload/RoomForm.js";*/




export const Editor = () => {
    return (
        <div className="editor-page">
           
            <RoomContainer />
           
        </div>
    );
}