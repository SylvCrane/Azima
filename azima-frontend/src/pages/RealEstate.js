import React from "react";
import "../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 

function RealEstate() {
    return (
        <div className="real-estate-page">
            <h1>MJ Home</h1>
            <p><br/><br/>View MJ Home's properties <a href="https://www.mjhome.co.nz/" target="new">here</a> {/* note: target allows the link to open on a new tab.*/}
            </p>
        </div>
    );
}

export default RealEstate;