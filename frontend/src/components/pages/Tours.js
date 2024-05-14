import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams if you're using React Router
import "../../css/style.css";
import "../../css/tour.css";
import TourContainer from '../tours/TourContainer';

export const Tours = () => {
    const [houses, setHouses] = useState([]);
    const { houseId } = useParams(); // Get houseId from the URL parameters
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                let url = 'http://localhost:8082/api/house/house/';
                if (houseId) {
                    url += 'puller/'+houseId; // Fetch data for a specific house
                } 
                const response = await axios.get(url); // Adjust this URL based on your actual API endpoint
                setHouses(response.data); // Axios wraps the response data inside a data property
            } catch (error) {
                console.error('Failed to fetch houses:', error);
            }
        };

        fetchHouses();
    }, [houseId]); // Effect runs whenever houseId changes

    return (
        <div className="tours-page">
            <h1>Tours</h1><br></br>
            <p>Featured tours for you to view</p><br></br><br></br>
            <div className="new-tour-button-container">
                <button className="new-tour-button" onClick={() => navigate("/editor")}> + Create a new tour! <br></br></button>
            </div>
            <br></br><br></br>
            {houses.map((house) => (
                <TourContainer key={house.houseID} house={house} />
            ))}
        </div>
    );
}