import React from "react";
import "../../css/style.css"; 
import "../../css/home.css"; 
import { useNavigate } from "react-router-dom";
import cameras360 from "../../assets/360cameras.png";
import rotation360 from "../../assets/360rotation.png";


export const Home = () => {

    const redirect = useNavigate();


    return (
        <>
        <div className="home-page-nav">
            <h1 className="home-header">Explore Every Angle: <br/>
                Experience 360° Virtual Tours!</h1><br/><br/>
            <p className="home-subheading">Easily create, edit and distribute your own virtual tour with <b className="home-subheading">Azima</b>, <br/>
            the leading software solution for producing immersive 360° tours. </p><br/><br/>
            No coding expertise required. 
            <br/>Simply follow the outlined steps to begin your tour at absolutely no cost! <br/><br/>
            Ideal for real estate, retail stores, event venues, education and more.
            <br/><br/><br/>
            
            <button className="join-btn" onClick={() => redirect('/account/signup')}>Join Now! </button>
        </div>

        <div className="home-page ">
            <h2>How Azima works</h2><br/>
            <p>Create your 360° virtual tour following the steps below</p><br></br><br></br>
            <div className="capture-container">
                <div className="capture-text">
                    <h3>1. Capture 360° Photos</h3>
                    <p>Use any 360° camera to take panoramic or spherical photos, ensuring you capture a full 360° view of your chosen areas.</p>
                    <img src={rotation360} alt="360 rotation" className="capture-image"></img>
                </div>
                <img src={cameras360} alt="360 cameras" className="capture-image"></img>
            </div>
            <br></br><br></br>
            <div className="edit-upload-container">
                <h3>2. Upload & Edit</h3>
                <h4>Create and Name Your Tour:</h4> Once your 360° images are ready, start by creating a new tour in the editor and give it a name.<br/>

                <h4>Add Rooms:</h4> For each room in your tour, upload the corresponding 360° image.<br/>

                <h4>Create Portals:</h4> After uploading all room images, you'll need to set up portals to connect the rooms. Additional information and instructions will be available in the editor.
            </div>
            <br></br><br></br>
            <div className="save-view-container">
                <h3>3. Save & View </h3>
            </div>
        </div>
        </>
    );
}