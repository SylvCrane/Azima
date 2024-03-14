import axios from 'axios';

export async function loadHouse(houseID) {

    try {
        const response = await axios.get(`http://localhost:8082/api/house/house/puller/${houseID}`);
        return response.data;
    }
    catch (err) {
        console.log("No houses loaded", err);
        throw err;
    }
}