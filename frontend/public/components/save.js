const params = new URLSearchParams(window.parent.location.search);
  console.log(params);
const houseID = params.get('houseID');
console.log("houseid: ",houseID)

document.addEventListener('DOMContentLoaded', () => {
const saveButton = document.getElementById('saveHouseBtn');

saveButton.addEventListener('click', () => {
    savePortals(houseID);
});
});

function savePortals(houseId){
    // Fetch existing house data to compare portals
    fetch(`http://localhost:8082/api/house/house/puller/${houseId}`)
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
        fetch('http://localhost:8082/api/portal/'+houseId)
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
                fetch(`http://localhost:8082/api/house/house/portals/${houseId}`, {
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
function clearPortals(houseId){
    fetch(`http://localhost:8082/api/portal/${houseId}`, {
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