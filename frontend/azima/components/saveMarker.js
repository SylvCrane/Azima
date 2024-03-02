import axios from 'axios';

export async function saveMarker(markerData, houseID) {

    const markerForm = new FormData();

    markerForm.append('houseID', houseID);
    markerForm.append('markerDetails', markerData);

    console.log(markerForm.append('houseID'));
    console.log(markerForm.append('markerDetails'));

    try {
        const response = await axios.post('http://localhost:8082/api/marker/marker/', markerForm);
        console.log(response);
    }
    catch (err)
    {
        console.log("The marker save did not work", err);
        throw err;
    }

};