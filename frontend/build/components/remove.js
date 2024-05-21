var counter = 1;
document.addEventListener('DOMContentLoaded', function() {
    var toggleListBtn = document.getElementById('toggle-list-btn');

    const sceneEl = document.querySelector('a-scene');


    const params = new URLSearchParams(window.parent.location.search);
  console.log(params);
const houseID = params.get('houseID');
console.log("houseid: ",houseID)


    toggleListBtn.addEventListener('click', function() {
        exitSidebar();
    });
    document.addEventListener('removePortal', (event) => {
    
        const portalEntity = event.detail;
        console.log('portal remove receievd with', portalEntity);
        sendDeleteRequest(portalEntity, houseID);
      });
});

function exitSidebar() {
    var sidebar = document.getElementById('portal-sidebar');
    var style = window.getComputedStyle(sidebar);
  
    // Check if the sidebar is currently visible
    if (style.transform === 'none' || style.transform === 'translateX(0px)') {
      // Sidebar is visible, slide it out
      sidebar.style.transform = 'translateX(0px)'; // Slide out to the right
    } else {
      // Sidebar is hidden, slide it in
      sidebar.style.transform = 'translateX(330px)'; // Slide in to be fully visible
    }
  }
 


function sendDeleteRequest(portalEntity, houseID) {
counter *= -1;
if (counter === -1){
    const location = portalEntity.className; // Assuming this is the intended use of 'className'
    const destination = portalEntity.id; // Assuming 'id' maps to 'destination'

    console.log(houseID, location, destination);

    // Check if houseID is defined
    if (!houseID) {
        console.error('houseID is undefined');
        return;
    }

    // Define API endpoints
    const deletePortalUrl = `https://azimatours.onrender.com/api/portal/portal/${houseID}?location=${encodeURIComponent(location)}&destination=${encodeURIComponent(destination)}`;
    const deleteNestedPortalUrl = `https://azimatours.onrender.com/api/house/house/${houseID}/portal?location=${encodeURIComponent(location)}&destination=${encodeURIComponent(destination)}`;

    // Use fetch to send a DELETE request to delete the portal directly
    fetch(deletePortalUrl, {
            method: 'DELETE',
            headers: {
                    'Content-Type': 'application/json',
                    // Include additional headers as required by the API, like authorization headers
            }
    })
    .then(response => {
            if (!response.ok) {
                    if (response.status === 404) {
                            // If the direct portal is not found, try to delete the nested portal
                            console.log('Direct portal not found, attempting to delete nested portal');
                            return fetch(deleteNestedPortalUrl, {
                                    method: 'DELETE',
                                    headers: {
                                            'Content-Type': 'application/json',
                                    }
                            });
                    }
                    // If other errors occur, throw to catch them later
                    throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // If deletion is successful, parse the JSON
    })
    .then(data => {
            if (data.msg) {
                    console.log('Portal delete successful', data);
                    refreshScene(portalEntity);

            } else {
                    // This block handles the response from the nested portal deletion attempt
                    console.log('Nested portal delete successful', data);
                    refreshScene(portalEntity);
            }
    })
    .catch((error) => {
            console.error('Error removing portal:', error);
    });

}
function refreshScene(portalEntity) {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            console.log('Emitting reloadScene event with details:', portalEntity);
            sceneEl.emit('reloadScene', { detail: { portalEntity: portalEntity } });
            console.log('reloadScene event emitted');
        } else {
            console.error('Scene element not found for refreshScene');
        }
    }
}