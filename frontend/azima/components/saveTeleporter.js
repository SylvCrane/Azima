import axios from 'axios';

export async function saveTeleporter(teleporterData, houseID) {

    const teleporterForm = new FormData();

    teleporterForm.append('houseID', houseID);
    teleporterForm.append('teleporterDetails', teleporterData);

    console.log(teleporterForm.append('houseID'));
    console.log(teleporterForm.append('teleporterDetails'));

    axios.post('http://localhost:8082/api/teleporter/teleporter/', teleporterForm)
        .then (res => {
            console.log(res);
        })
        .catch(err => {
            console.log("The teleporter submission failed");
        })
};