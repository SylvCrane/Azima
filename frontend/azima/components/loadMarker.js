import axios from 'axios';

export async function loadMarker(houseID) {

    try {
        const response = await axios.get(`http://localhost:8082/api/marker/markerpuller/${houseID}`);
        return response.data;
    }
    catch (err) {
        console.log("No marker loaded", err);
        throw err;
    }
}