import React from 'react';
import "../../css/tour.css";
import "../../css/style.css";
import bathIcon from '../../assets/bath-solid.svg';
import bedIcon from '../../assets/bed-solid.svg';
import livingAreaIcon from '../../assets/couch-solid.svg';
import floorAreaIcon from '../../assets/expand-solid.svg';

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
    const cardClass = `card ${house.public ? 'public' : 'non-public'}`;
    return (
        <div className={cardClass}>
            <div className="tours-content">
                <div className="thumbnail">
                    <div className="address">{house.location}</div>
                    <div className="author">{house.author}</div>
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
                    <button className="btn" onClick={handleExploreClick}>Explore</button>
                </div>
             
            </div>
            <div className="public-private-indicator">
                            {house.public ? 'Public' : 'Private'}
                        </div>
        </div>
    );
}

export default TourContainer;