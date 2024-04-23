import React from "react";
import "../../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 
import { useNavigate } from "react-router-dom";
//import MetaQuest from '../../assets/MetaQuest.png';

export const Home = () => {

    const redirect = useNavigate();

    return (
        <>
        <div className="home-page-nav">
            <h1>Explore Every Angle: <br/>
                Experience 360° Virtual Tours!</h1><br/><br/>
            Easily create, edit and distribute your own virtual tour with <b>Azima</b>, <br/>
            the leading software solution for producing immersive 360° tours. <br/><br/>
            No coding expertise required. 
            <br/>Simply follow the outlined steps to begin your tour at absolutely no cost! <br/><br/>
            Ideal for real estate, retail stores, event venues, education and more.
            <br/><br/><br/>
            
            <button className="join-btn" onClick={() => redirect('/account/signup')}>Join Now! </button>
        </div>

        <div className="home-page ">
            {/*<img src={MetaQuest} alt="Meta Quest"  style={{ width: "800px", height: "auto", marginTop: "50px"}}></img>*/}
            <h3>How Azima works</h3>
            <p>Create your 360° virtual tour following the steps below</p>
            <br/><br/>
            <h4>1. Capture </h4>
            <p>Use any 360° camera to take panoramic or spherical photos, ensuring you capture a full 360° view of your chosen areas.</p>
            <br/><br/>
            <h4>2. Upload & Edit</h4>
            <p></p>
            <br/><br/>
            <h4>3. Save and View</h4>

        </div>
        </>
    );
}