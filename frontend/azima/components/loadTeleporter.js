import axios from 'axios';

export async function loadTeleporter(houseID) {

    try {
        const response = await axios.get(`http://localhost:8082/api/teleporter/puller/${houseID}`);
        return response.data;
    }
    catch (err) {
        console.log("No teleporters loaded", err);
        throw err;
    }
}