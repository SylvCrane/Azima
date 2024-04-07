import React from "react";
import "../../css/style.css"; // NOTE: put 2 . ("..") since this file is in it's own folder too. 
import { useNavigate } from "react-router-dom";

export const Home = () => {

    const redirect = useNavigate();

    return (
    
        <>
        <div className="home-page-nav">
            <h1>Create, Edit and Share <br/>
                360° Virtual Tours!</h1><br/><br/>
            Easily create, edit and share virtual tours with Azima, <br/>
            the leading software for producing immersive 360° tours. <br/>
            Ideal for real estate, architecture construction, education and more!
            <br/><br/><br/><br/>
            
            <button className="join-btn" onClick={() => redirect('/account/signup')}>Join Now! </button>
        </div>

        {/*<div className="home-page ">
            Easily create, edit and share virtual tours with Azima,<br/> 
            the leading software for producing immersive 360° tours. Ideal for real estate, 
            architecture construction, education and more!
            <br/><br/>
            
            <button className="join-btn" onClick={() => redirect('/account/signup')}>Join Now! </button>
        
        </div>*/}
        </>
        
    );
}