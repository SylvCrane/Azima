import React from "react";
import "../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 

export const About = () => {
    return (
        <div className="about-page">
            <h2>About Us</h2>
            <br/>
            Welcome to Azima! our platform allows you to link your 360° images together to create a virtual tour that you can save and share!
            <br/><br/>
                <p>At Azima, our aim is to revolutionize the real estate industry through cutting-edge technological solutions. 
                In collaboration with leading New Zealand companies - <a href="https://www.mjhome.co.nz/">MJ Home </a> and <a href="https://www.jd.net.nz/">Jayden Digital</a> our focus is to enhance the property 
                viewing experience for their potential buyers and investors. </p>
            <br/><br/>
                Our mission is to eliminate the challenges of traditional property viewings by providing a solution where you can explore properties 
                in the comfort of your own home through a 360° virtual tour! 

            <br/><br/>
                Azima allows yourself or your company to upload your 360° images and link them together to create your own virtual tour.<br/>
                Simply sign up or log in to get started!
            
        </div>
    );
}