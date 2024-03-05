import React from "react";
import "../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 

export const About = () => {
    return (
        <div className="about-page">
            <h2>About Us</h2>
            <br/>
            Welcome to Azima! our platform allows you to link your 360° images together to create a virtual tour that you can save and share!
            <br/><br/>
            <p>Our project started with <a href="https://www.mjhome.co.nz/">MJ Home </a>, a leading New Zealand real estate company. Through our editor
            application we were able to offer a solution that allows users to view and explore properties from the comfort of their homes</p>

            Beyond real estate our platform can also tranform any set of images into immersive virtual tours. Whether it be your airbnb, a retail store
            or the outdoors, Azima can do it all!

            <br/><br/>
                Simply sign up or log in to get started!
            
        </div>
    );
}