/**
 * remove.js
 * Description: Manages the removal of portals in the Azima platform. Handles UI interactions, sends delete requests to the server, and manages the sidebar visibility.
 */

var counter = 1;

document.addEventListener('DOMContentLoaded', function() {
    var toggleListBtn = document.getElementById('toggle-list-btn');
    const sceneEl = document.querySelector('a-scene');
    const params = new URLSearchParams(window.parent.location.search);
    const houseID = params.get('houseID');
    console.log("houseid: ", houseID);

    /**
     * click Event Listener (toggleListBtn)
     * Listens for click events on the toggleListBtn to toggle the sidebar visibility.
     */
    toggleListBtn.addEventListener('click', function() {
        exitSidebar();
    });

    /**
     * removePortal Event Listener
     * Listens for removePortal events to initiate the portal removal process.
     * Sends a delete request to the server with the portal entity and house ID.
     */
    document.addEventListener('removePortal', (event) => {
        const portalEntity = event.detail;
        console.log('portal remove received with', portalEntity);
        sendDeleteRequest(portalEntity, houseID);
    });
});

/**
 * exitSidebar()
 * Toggles the visibility of the portal sidebar by adjusting its transform property.
 */
function exitSidebar() {
    var sidebar = document.getElementById('portal-sidebar');
    var style = window.getComputedStyle(sidebar);

    if (style.transform === 'none' || style.transform === 'translateX(0px)') {
        sidebar.style.transform = 'translateX(0px)'; // Slide out to the right
    } else {
        sidebar.style.transform = 'translateX(330px)'; // Slide in to be fully visible
    }
}

/**
 * sendDeleteRequest(portalEntity, houseID)
 * Sends a delete request to the server to remove the specified portal.
 * Attempts to delete the direct portal first, then tries to delete the nested portal if the direct portal is not found.
 * @param {HTMLElement} portalEntity - The portal entity to be deleted.
 * @param {string} houseID - The ID of the house to which the portal belongs.
 */
function sendDeleteRequest(portalEntity, houseID) {
    counter *= -1;
    if (counter === -1) {
        const location = portalEntity.className; // Assuming this is the intended use of 'className'
        const destination = portalEntity.id; // Assuming 'id' maps to 'destination'

        console.log(houseID, location, destination);

        if (!houseID) {
            console.error('houseID is undefined');
            return;
        }

        const deletePortalUrl = `https://azimatours.onrender.com/api/portal/portal/${houseID}?location=${encodeURIComponent(location)}&destination=${encodeURIComponent(destination)}`;
        const deleteNestedPortalUrl = `https://azimatours.onrender.com/api/house/house/${houseID}/portal?location=${encodeURIComponent(location)}&destination=${encodeURIComponent(destination)}`;

        fetch(deletePortalUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('Direct portal not found, attempting to delete nested portal');
                    return fetch(deleteNestedPortalUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // If deletion is successful, parse the JSON
        })
        .then(data => {
            if (data.msg) {
                console.log('Portal delete successful', data);
                refreshScene(portalEntity);
            } else {
                console.log('Nested portal delete successful', data);
                refreshScene(portalEntity);
            }
        })
        .catch((error) => {
            console.error('Error removing portal:', error);
        });
    }
}

/**
 * refreshScene(portalEntity)
 * Refreshes the scene by emitting a reloadScene event with the details of the portal entity.
 * @param {HTMLElement} portalEntity - The portal entity that was deleted.
 */
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