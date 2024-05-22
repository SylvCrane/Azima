const params = new URLSearchParams(window.parent.location.search);
  console.log(params);
const houseID = params.get('houseID');
console.log("houseid: ",houseID)

document.addEventListener('DOMContentLoaded', () => {
  
    // Initialize 'Publish' button
    const publishButton = document.getElementById('publish');
    if (publishButton) {
      publishButton.addEventListener('click', () => {
        publishHouse(houseID);
      });
    }
  
    // Initialize 'Exit Without Saving' button
    const exitButton = document.getElementById('exitNoSave');
    if (exitButton) {
      exitButton.addEventListener('click', () => {
        if (window.confirm("Are you sure you want to discard changes and exit?")) {
          navigateToTours();
        }
      });
    }
  
    // Initialize 'Save and Quit' button
    const saveButton = document.getElementById('saveQuit');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
       saveQuit(houseID);
      });
    }
    const exitTourButton = document.getElementById('exitTour');
    if (exitTourButton) {
        console.log('clicked');
      exitTourButton.addEventListener('click', () => {
       navigateToTours();
      });
    }
  
    // Initialize 'Details' element
    const detailsElement = document.getElementById('Details');
    const detailsContainer = document.getElementById('detailsBox');
    if (detailsElement && detailsContainer) {
      detailsElement.addEventListener('click', () => {
        // Fetch and inject house details
        fetchAndInjectDetails(houseID, detailsContainer);
        console.log('clicked');
      });
    }
  });

 
    

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
  function fetchAndInjectDetails(houseId, container) {
    // Fetch house details from the backend
    fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)

      .then(response => response.json())
      .then(houseDetails => {
        if (houseDetails && houseDetails.length > 0) {
          const detailsHtml = `
          <div class="details">
          <div class="details-content">
  <img class="house-icon" src=./assets/LogoAsset.svg" alt="House" style="width: 24px; height: 24px;" />
  <span class="house-address">${houseDetails[0].location}</span>
  <div class="house-details">
    <img class="details-icon" src="./assets/bed-solid.svg" alt="Bedrooms" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].bedrooms}</span>
    <img class="details-icon" src="./assets/bath-solid.svg" alt="Bathrooms" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].bathrooms}</span>
    <img class="details-icon" src="./assets/couch-solid.svg" alt="Living Areas" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].livingAreas}</span>
    <img class="details-icon" src="./assets/expand-solid.svg" alt="Floor Area" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].sqFootage.$numberDecimal}m²</span>
    <div class="house-details">
    <img class="details-icon" src="./assets/tree-solid.svg" alt="Backyard" style="width: 20px; height: 20px;" />
    <span class="details-text">
      <img src="${houseDetails[0].backyard ? './assets/check-solid.svg' : './assets/xmark-solid.svg'}" alt="${houseDetails[0].backyard ? 'Yes' : 'No'}" style="width: 20px; height: 20px;">
    </span>
    <div class="house-details">
    <img class="details-icon" src="./jug-detergent-solid.svg" alt="Laundry" style="width: 20px; height: 20px;" />
    <span class="details-text">
      <img src="${houseDetails[0].laundry ? './assets/check-solid.svg' : './assets/xmark-solid.svg'}" alt="${houseDetails[0].laundry ? 'Yes' : 'No'}" style="width: 20px; height: 20px;">
    </span>
    <img class="details-icon" src="./assets/dollar-sign-solid.svg" alt="Price" style="width: 20px; height: 20px;" /><span class="details-text">${houseDetails[0].price.$numberDecimal}/wk</span>
    <img class="details-icon" src="./assets/calendar-regular.svg" alt="Date Available" style="width: 20px; height: 20px;" /><span class="details-text">${formatDate(houseDetails[0].dateListed )}</span>
  

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
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);  // Adjust 'en-US' to your locale as needed
  }

function publishHouse(houseId){
    // Fetch existing house data to compare portals
    fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
    })
    .then(existingHouseData => {
        // Assuming existingHouseData contains the portals array
        console.log(existingHouseData[0]);
        const existingPortals = existingHouseData[0].portals || [];
         console.log(existingPortals);
        fetch('https://azimatours.onrender.com/api/portal/'+houseId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json(); // Parse the JSON of the response
        })
        .then(newPortals => {
            console.log('Portals loaded successfully:', newPortals);
            
            // Filter out duplicate portals based on a unique attribute (e.g., portalId)
            const uniquePortals = newPortals.filter(np => !existingPortals.some(ep => ep.portalId === np.portalId));

            if (uniquePortals.length > 0) {
                // Proceed with update if there are new, unique portals
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
                    navigateToSave();// Consider whether you still want to clear all portals after this
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
function saveQuit(houseId){
    // Fetch existing house data to compare portals
    fetch(`https://azimatours.onrender.com/api/house/house/puller/${houseId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
    })
    .then(existingHouseData => {
        // Assuming existingHouseData contains the portals array
        console.log(existingHouseData[0]);
        const existingPortals = existingHouseData[0].portals || [];
         console.log(existingPortals);
        fetch('https://azimatours.onrender.com/api/portal/'+houseId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json(); // Parse the JSON of the response
        })
        .then(newPortals => {
            console.log('Portals loaded successfully:', newPortals);
            
            // Filter out duplicate portals based on a unique attribute (e.g., portalId)
            const uniquePortals = newPortals.filter(np => !existingPortals.some(ep => ep._id === np._id));

            if (uniquePortals.length > 0) {
                // Proceed with update if there are new, unique portals
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
               // Consider whether you still want to clear all portals after this
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
function clearPortals(houseId){
    fetch(`https://azimatours.onrender.com/api/portal/${houseId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        console.log('Portals of ' + houseId + ' cleared successfully');
    })
    .catch(error => {
        if (error.message.includes('404')) {
            console.log('No portals found under the specified route.');
        } else {
            console.error('Failed to clear portals:', error);
        }
    });
}

function navigateToSave() {
    window.parent.postMessage({ action: 'navigate', path: '/editor/save?houseID=' + encodeURIComponent(houseID) }, '*');
}
function navigateToTours(){
    window.parent.postMessage({ action: 'navigate', path: '/tours'}, '*');
}


