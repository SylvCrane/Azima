import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams if you're using React Router
import "../../../css/style.css";
import "../../../css/tour.css";
import TourContainer from '../../tours/TourContainer';
import { useUser } from '../../../authentication/UserState';
    
export const UserTours = () => {
    const [houses, setHouses] = useState([]);
    const { houseId } = useParams(); // Get houseId from the URL parameters
    const navigate = useNavigate();
    const [user] = useUser();
    
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                let url = 'https://azimatours.onrender.com/api/house/house/author/'+ user.email;
                
                const response = await axios.get(url); // Adjust this URL based on your actual API endpoint
                setHouses(response.data); // Axios wraps the response data inside a data property
            } catch (error) {
                console.error('Failed to fetch houses:', error);
            }
        };

        fetchHouses();
    }, [houseId, user.email]); // Effect runs whenever houseId changes
    
    return (
        <div className="user-tours-page">
            <h1>My Tours</h1><br></br>
            <p>Tours you have created</p><br></br><br></br>
            <div className="new-tour-button-container">
                <button className="new-tour-button" onClick={() => navigate("/editor")}>+ Create a new tour!</button>
            </div>
            <br></br><br></br>
            {houses.map((house) => (
                <TourContainer key={house.houseID} house={house} />
            ))}
        </div>
    );
};