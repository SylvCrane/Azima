import React, {useState, useEffect} from 'react';
import "../../css/tour.css";
import "../../css/style.css";
import bathIcon from '../../assets/bath-solid.svg';
import bedIcon from '../../assets/bed-solid.svg';
import livingAreaIcon from '../../assets/couch-solid.svg';
import floorAreaIcon from '../../assets/expand-solid.svg';
import axios from 'axios';

const TourContainer = ({ house }) => {
    // Function to handle the click event of the "Explore" button
    const handleExploreClick = () => {
        // Dispatch a custom event if needed
        const event = new CustomEvent('activateTour', { detail: { houseID: house.houseID } });
        window.dispatchEvent(event);
        console.log('Navigating to AFrame tour with houseID:', house.houseID);

        // Navigate to the AFrame URL
        window.location.href = `/tours/aframe?houseID=${encodeURIComponent(house.houseID)}`;
    };
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('https://azimatours.onrender.com/api/userprofile/search/'+house.author);

                const users = response.data;
              
                
                setUserDetails(users.user.username);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [house.author]);


    const getUserName = () => {
        if (userDetails) {
            return userDetails;
        }
        return 'Unknown';
    };
const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this house?')) {
        console.log('Deleting house with ID:', house.houseID);
        
        axios.delete(`https://azimatours.onrender.com/api/house/house/${house.houseID}`)
            .then(response => {
                console.log('House deleted successfully');
                // Refresh the page to reflect the removal of the portal
                window.location.reload();
                // Perform any additional actions after successful deletion
            })
            .catch(error => {
                console.error('Error deleting house:', error);
                // Handle the error appropriately
            });
    }
};

  


    const cardClass = `card ${house.public ? 'public' : 'non-public'}`;
    return (
        <div className={cardClass}>
            <div className="tours-content">
                <div className="thumbnail">
                    <div className="address">{house.location}</div>
                    <div className="author">{getUserName()}</div>
                    <div className="houseName">{house.houseName}</div>
                    {/*<img src={house.thumbnail} alt="Main Photo of Property" />*/}
                    <img src={house.thumbnail} alt="Property" />
                </div>
                
                <div className="sidebar">
                    <div className="details">
                        <div className="stats">
                            <div className="detail">
                                <img src={bedIcon} className="Bedrooms" alt="Bedrooms" />
                                <span>{house.bedrooms} Bedroom(s)</span>
                            </div>
                            <div className="detail">
                                <img src={floorAreaIcon} className="sqFoot" alt="sqFoot" />
                                <span>
                                    {house.sqFootage && house.sqFootage.$numberDecimal ? `${house.sqFootage.$numberDecimal}m² Floor` : ''}
                                </span>
                            </div>
                            <div className="detail">
                                <img src={livingAreaIcon} className="Living Area" alt="Living Area" />
                                <span>{house.livingAreas} Living Area(s)</span>
                            </div>
                            <div className="detail">
                                <img src={bathIcon} className="Bathroom" alt="Bathrooms" />
                                <span>{house.bathrooms} Bathroom(s)</span>
                            </div>
                        </div>
                        <div className="price">
                            <span>
                                {house.price && house.price.$numberDecimal ? `$${house.price.$numberDecimal}/wk` : 'Price data not available'}
                            </span>
                        </div>
                    </div>
                    <div className="options">
                    <button className="explore-btn" onClick={handleExploreClick}>Explore</button>
                    <button className="delete-btn" onClick={handleDeleteClick}>Remove</button>
                    </div>
                </div>
             
            </div>
            <div className="public-private-indicator">
                            {house.public ? 'Public' : 'Private'}
                        </div>
        </div>
    );
}

export default TourContainer;