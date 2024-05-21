import React from "react";
import "../../css/style.css"; 
import "../../css/home.css"; 
import { useNavigate } from "react-router-dom";
import cameras360 from "../../assets/360cameras.png";
import rotation360 from "../../assets/360rotation.png";
import MetaQuest2 from "../../assets/MetaQuest.png";
import { FlipCards } from "./FlipCard";
import AzimaLogo from "../../assets/LogoAsset.svg";
import MailSVG from "../../assets/mail-icon.svg";
import editor1 from "../../assets/editor-first.jpg";
import editor2 from "../../assets/editor-final.jpg";

export const Home = () => {

    const redirect = useNavigate();


    return (
        <>
        <div className="home-page-container">
            <div className="home-page-nav">
                <h1 className="home-header">Explore Every Angle: <br/>
                    Experience 360° Virtual Tours!</h1><br/><br/>
                <p className="home-subheading">Easily create, edit and publish your own virtual tour with <b className="home-subheading">Azima</b>, <br/>
                the leading software solution for producing immersive 360° tours. </p><br/><br/>
                No coding expertise required. 
                <br/>Simply follow the outlined steps to begin your tour at absolutely no cost! <br/><br/>
                Ideal for real estate, retail stores, event venues, education and more.
                <br/><br/><br/>
                <button className="join-btn" onClick={() => redirect('/account/signup')}>Join Now! </button>
            </div>

            <div className="home-page ">
                <div className="introduction">
                    <h4 className="subtitle">Getting Started</h4>
                    <h2 className="intro-title">What is a 360° Virtual Tour?</h2>
                    <p className="description">
                        A 360° Virtual Tour is an interactive digital representation of a physical space, created from interconnected panoramic images.
                        This allows you to navigate and explore the location in a seamless 360-degree view.
                        By clicking or tapping on the screen, you can virtually "walk" through the space, experiencing it as if you were physically there!
                        <br></br><br></br>
                        With Azima, you can design and host your own 360° virtual tours using your panoramic images, incorporating portals to seamlessly navigate between different spaces within your tour.
                    </p>
                    <div className="button-container">
                        <button className="btn get-started" onClick={() => redirect('/account/signup')}>Get Started</button>
                        <button className="btn examples" onClick={() => redirect('/tours')}>View 360° Virtual Tour Examples</button>
                    </div>
                </div>
            
                <br></br>

                <div className="azima-menu">
                    <h2>How Azima works</h2>
                    <p>Create your 360° virtual tour following the steps below</p>
                    <br></br><br></br>
                    <div className="capture-container">
                        <div className="capture-text">
                            <h3>1. Capture 360° Photos</h3><br></br><br></br>
                            <p>Use any 360° camera to take panoramic or spherical photos, ensuring you capture a full 360° view of your chosen areas.</p>
                            <img src={rotation360} alt="360 rotation" className="capture-image"></img>
                        </div>
                        <img src={cameras360} alt="360 cameras" className="capture-image"></img>
                    </div>
                    <div className="edit-upload-container">
                        <h3>2. Upload & Edit</h3><br></br><br></br>
                        <h4>Create and Name Your Tour:</h4>
                        <p>Once your 360° images are ready, start by creating a new tour in the editor and give it a name.</p><br/>
                        <h4>Add Rooms:</h4>
                        <p>For each room in your tour, upload the corresponding 360° image.</p><br/>
                        <img src={editor1} alt="editor" className="editor1"></img><br></br><br></br>
                        <h4>Create Portals:</h4>
                        <p>After uploading all room images, you'll need to set up portals to connect the rooms. Additional information and instructions will be available in the editor.</p><br/>
                        <img src={editor2} alt="editor2" className="editor2"></img><br/>
                    </div>
                    <div className="save-view-container">
                        <h3>3. Save & View</h3><br></br>
                        <p>Once you've created the portals and linked your images, you can save and publish your tour. By default, all tours will be displayed only on your account. However, you have the option to share them publicly, making them available on our tours page for other users to explore.</p>
                        <br></br><br></br>
                        <button className="explore-tours-btn" onClick={() => redirect('/tours')}>Explore tours now!</button>
                    </div>
                </div>

                <div className="vr-container">
                    <img src={MetaQuest2} alt="Meta Quest 2" className="meta-image"></img>
                    <div className="vr-text">
                        <h3>Step into the world of Virtual Reality!</h3><br></br><br></br>
                        <span>Use our VR app to experience tours with Meta Quest 2 headsets, allowing for a more immersive and engaging way to explore your surroundings.</span>
                        <br></br>
                        <span>(More information to be released later on about compatibility with other VR headsets)</span>
                    </div>
                </div>

                <div className="common-container">
                    <h1>Common Questions</h1>
                    <h4>Click on a card to reveal the answer</h4>
                    <br></br><br></br>
                    <FlipCards/>
                </div>
            </div>

            <div className="home-page-bottom-nav">
                <div className="footer-left">
                    <img src={AzimaLogo} alt="Azima" className="logo-image"></img>
                    © 2024 Azima. All Rights Reserved.
                </div>
                <div className="footer-right">
                    <img src={MailSVG} alt="mail" className="mail-image"></img>
                    Contact us at<br/>
                    <a href="/help">azimatours@gmail.com</a>
                </div>
            </div>
        </div>
        </>
    );
}