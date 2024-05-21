import React from "react";
import "../../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 

import SaveState from "../fileUpload/Save.js"; 




export const Save = () => {
    return (
        <div className="editor-page">
           
            <SaveState />
           
        </div>
    );
}