import axios from 'axios';

export async function saveTeleporter(teleporterData, houseID) {

    const teleporterForm = new FormData();

    teleporterForm.append('houseID', houseID);
    teleporterForm.append('teleporterDetails', teleporterData);

    console.log(teleporterForm.append('houseID'));
    console.log(teleporterForm.append('teleporterDetails'));

    try {
        const response = await axios.post('http://localhost:8082/api/teleporter/teleporter/', teleporterForm);
        console.log(response);
    }
    catch (err)
    {
        console.log("The teleporter save did not work", err);
        throw err;
    }
};