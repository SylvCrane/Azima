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
                let url = 'http://localhost:8082/api/house/house/public';
                if (houseId) {
                    url += '/puller/' + houseId; // Correct the URL to ensure it's valid
                }
                const response = await axios.get(url);
                console.log(response.data.data); // Log the data for debugging

                // Check if the response.data is an array and has at least one item
                if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                    setHouses(response.data.data);
                } else {
                    console.log('No houses found or invalid data structure:', response.data);
                    setHouses([]); // Set to an empty array or handle as needed
                }
            } catch (error) {
                console.error('Failed to fetch houses:', error);
                setHouses([]); // Optionally set to empty array on error
            }
        };

        fetchHouses();
    }, [houseId]);
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