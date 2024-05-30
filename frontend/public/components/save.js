import { navigateToSave, navigateToTours } from './navigation'; // Add missing import for navigateToSave and navigateToTours
 // Add missing import for encodeURIComponent
/**
 * save.js
 * Description: Manages the saving and publishing of house data and portals in the Azima platform. Handles UI interactions and sends appropriate requests to the server.
 */

const params = new URLSearchParams(window.parent.location.search);
const houseID = params.get('houseID');
console.log("houseid: ", houseID);

document.addEventListener('DOMContentLoaded', () => {
  /**
   * click Event Listener (publishButton)
   * Listens for click events on the publish button to publish the house data.
   */
  const publishButton = document.getElementById('publish');
  if (publishButton) {
    publishButton.addEventListener('click', () => {
      publishHouse(houseID);
    });
  }

  /**
   * click Event Listener (exitButton)
   * Listens for click events on the exit button to navigate away without saving.
   */
  const exitButton = document.getElementById('exitNoSave');
  if (exitButton) {
    exitButton.addEventListener('click', () => {
      if (window.confirm("Are you sure you want to discard changes and exit?")) {
        navigateToTours();
      }
    });
  }

  /**
   * click Event Listener (saveButton)
   * Listens for click events on the save and quit button to save the house data and then exit.
   */
  const saveButton = document.getElementById('saveQuit');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      saveQuit(houseID);
    });
  }

  /**
   * click Event Listener (exitTourButton)
   * Listens for click events on the exit tour button to navigate to the tours page.
   */
  const exitTourButton = document.getElementById('exitTour');
    exitTourButton.addEventListener('click', () => {
        navigateToTours();
    });

    /**
     * click Event Listener (detailsElement)
     * Listens for click events on the details element to fetch and display house details.
     */
    const detailsElement = document.getElementById('Details');
    const detailsContainer = document.getElementById('detailsBox');
    if (detailsElement && detailsContainer) {
        detailsElement.addEventListener('click', () => {
            fetchAndInjectDetails(houseID, detailsContainer);
            console.log('clicked');
        });
    }

    /**
     * setupEventListeners()
     * Sets up the event listeners for the close button in the details box.
     */
    function setupEventListeners() {
        const closeButton = document.getElementById('closeBtn');
        if (closeButton) {
            console.log("Close button found; adding event listener.");
            closeButton.addEventListener('click', function() {
                console.log("Close button clicked.");
                const detailsContainer = document.getElementById('detailsBox');
                detailsContainer.innerHTML = '';
            });
        } else {
            console.log("Close button not found.");
        }
    }

    /**
     * fetchAndInjectDetails(houseId, container)
     * Fetches house details from the backend and injects them into the specified container.
     * @param {string} houseId - The ID of the house to fetch details for.
     * @param {HTMLElement} container - The container to inject the details into.
     */
    function fetchAndInjectDetails(houseId, container) {
        fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)
            .then(response => response.json())
            .then(houseDetails => {
                if (houseDetails && houseDetails.length > 0) {
                    const detailsHtml = `
                    <div class="details">
                        <div class="details-content">
                            <img class="house-icon" src="./assets/LogoAsset.svg" alt="House" style="width: 24px; height: 24px;" />
                            <span class="house-address">${houseDetails[0].location}</span>
                            <div class="house-details">
                                <img class="details-icon" src="./assets/bed-solid.svg" alt="Bedrooms" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].bedrooms}</span>
                                <img class="details-icon" src="./assets/bath-solid.svg" alt="Bathrooms" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].bathrooms}</span>
                                <img class="details-icon" src="./assets/couch-solid.svg" alt="Living Areas" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].livingAreas}</span>
                                <img class="details-icon" src="./assets/expand-solid.svg" alt="Floor Area" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].sqFootage.$numberDecimal}m²</span>
                                <img class="details-icon" src="./assets/tree-solid.svg" alt="Backyard" style="width: 20px; height: 20px;" /><span class="details-text"><img src="${houseDetails[0].backyard ? './assets/check-solid.svg' : './assets/xmark-solid.svg'}" alt="${houseDetails[0].backyard ? 'Yes' : 'No'}" style="width: 20px; height: 20px;"></span>
                                <img class="details-icon" src="./assets/jug-detergent-solid.svg" alt="Laundry" style="width: 20px; height: 20px;" /><span class="details-text"><img src="${houseDetails[0].laundry ? './assets/check-solid.svg' : './assets/xmark-solid.svg'}" alt="${houseDetails[0].laundry ? 'Yes' : 'No'}" style="width: 20px; height: 20px;"></span>
                                <img class="details-icon" src="./assets/dollar-sign-solid.svg" alt="Price" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].price.$numberDecimal}/wk</span>
                                <img class="details-icon" src="./assets/calendar-regular.svg" alt="Date Available" style="width: 20px; height: 20px;" /><span class="details-text">${formatDate(houseDetails[0].dateListed)}</span>
                            </div>
                        </div>
                        <button id="closeBtn" style="border: none; background: none;">
                            <img src="./assets/xmark-solid.svg" alt="Close" style="width: 30px; height: 30px;">
                        </button>
                    </div>
                    `;
                    container.innerHTML = detailsHtml;
                    setupEventListeners();
                } else {
                    console.log('No details available for this house.');
                }
            })
            .catch(error => console.error('Failed to fetch house details:', error));
    }

    /**
     * formatDate(dateString)
     * Formats a date string into a human-readable format.
     * @param {string} dateString - The date string to format.
     * @returns {string} - The formatted date string.
     */
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options); // Adjust 'en-US' to your locale as needed
    }

    /**
     * publishHouse(houseId)
     * Publishes the house data by fetching existing house data and new portals, filtering out duplicates, and updating the house portals.
     * @param {string} houseId - The ID of the house to publish.
     */
    function publishHouse(houseId) {
        fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(existingHouseData => {
                const existingPortals = existingHouseData[0].portals || [];
                fetch('https://azimatours.onrender.com/api/portal/' + houseId)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok (${response.status})`);
                        }
                        return response.json(); // Parse the JSON of the response
                    })
                    .then(newPortals => {
                        const uniquePortals = newPortals.filter(np => !existingPortals.some(ep => ep.portalId === np.portalId));

                        if (uniquePortals.length > 0) {
                            fetch(`https://azimatours.onrender.com/api/house/house/portals/${houseId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(uniquePortals),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);
                                    clearPortals(houseId);
                                    navigateToSave();
                                })
                                .catch((error) => console.error('Error:', error));
                        } else {
                            console.log('No new portals to add. Skipping update.');
                            navigateToSave();
                        }
                    })
                    .catch(error => {
                        console.error('Failed to load new portal data:', error);
                    });
            })
            .catch(error => {
                console.error('Failed to load existing house data:', error);
            });
    }

    /**

    	•	saveQuit(houseId)
    	•	Saves the house data and quits by fetching existing house data and new portals, filtering out duplicates, and updating the house portals.
    	•	@param {string} houseId - The ID of the house to save and quit.
    */
    function saveQuit(houseId) {
        fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(existingHouseData => {
                const existingPortals = existingHouseData[0].portals || [];
                fetch(`https://azimatours.onrender.com/api/portal/${houseId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok (${response.status})`);
                        }
                        return response.json(); // Parse the JSON of the response
                    })
                    .then(newPortals => {
                        const uniquePortals = newPortals.filter(np => !existingPortals.some(ep => ep._id === np._id));
                        if (uniquePortals.length > 0) {
                            fetch(`https://azimatours.onrender.com/api/house/house/portals/${houseId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(uniquePortals),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);
                                    clearPortals(houseId);
                                    navigateToTours();
                                })
                                .catch((error) => console.error('Error:', error));
                        } else {
                            console.log('No new portals to add. Skipping update.');
                            navigateToTours();
                        }
                    })
                    .catch(error => {
                        console.error('Failed to load new portal data:', error);
                    });
            })
            .catch(error => {
                console.error('Failed to load existing house data:', error);
            });
    }

    /**

            •	clearPortals(houseId)
            •	Clears all portals associated with the specified house by sending a delete request to the server.
            •	@param {string} houseId - The ID of the house to clear portals for.
    */
    function clearPortals(houseId) {
        fetch(`https://azimatours.onrender.com/api/portal/${houseId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                console.log(`Portals of ${houseId} cleared successfully`);
            })
            .catch(error => {
                if (error.message.includes('404')) {
                    console.log('No portals found under the specified route.');
                } else {
                    console.error('Failed to clear portals:', error);
                }
            });
    }

    /**

    	•	navigateToSave()
    	•	Navigates to the save page for the current house.
    */
    function navigateToSave() {
        window.parent.postMessage({ action: 'navigate', path: '/editor/save?houseID=' + encodeURIComponent(houseID) }, ''); // Replace invalid characters
    }

    /**

    		navigateToTours()
    		Navigates to the tours page.
    */
    function navigateToTours() {
        window.parent.postMessage({ action: 'navigate', path: '/tours' }, ''); // Replace invalid characters
    }

});