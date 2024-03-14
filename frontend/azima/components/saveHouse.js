import axios from 'axios';

export async function saveHouse(houseData) {

    const houseForm = new FormData();

    houseForm.append('houseID', houseData.houseID);
    houseForm.append('rooms', houseData.rooms);
    houseForm.append('bathrooms', houseData.bathrooms);
    houseForm.append('livingAreas', houseData.livingAreas);
    houseForm.append('sqFootage', houseData.sqFootage);
    houseForm.append('price', houseData.price);
    houseForm.append('dateListed', houseData.dateListed);
    houseForm.append('location', houseData.location);
    houseForm.append('kitchen', houseData.kitchen);
    houseForm.append('backyard', houseData.backyard);
    houseForm.append('laundryRoom', houseData.laundryRoom);
    houseForm.append('backyard', houseData.backyard);

    try {
        const response = await axios.post('http://localhost:8082/api/house/', houseForm);
        console.log(response);
    }
    catch (err)
    {
        console.log("The house save did not work", err);
        throw err;
    }
};