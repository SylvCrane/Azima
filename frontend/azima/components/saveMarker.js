import axios from 'axios';

export async function saveMarker(markerData, houseID) {

    const markerForm = new FormData();

    markerForm.append('houseID', houseID);
    markerForm.append('markerDetails', markerData);

    console.log(markerForm.append('houseID'));
    console.log(markerForm.append('markerDetails'));

    axios.post('http://localhost:8082/api/marker/marker/', markerForm)
        .then (res => {
            console.log(res);
        })
        .catch(err => {
            console.log("The marker submission failed");
        })
};