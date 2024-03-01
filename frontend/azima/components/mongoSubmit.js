import axios from 'axios';
import { cloudinarySubmit } from './cloudinarySubmit';

export async function mongoSubmit(cloudinary, mongo) {

    const imageURL = await cloudinarySubmit(cloudinary);

    mongo.append('imageURL', imageURL);
    console.log(mongo.get('name'));
    console.log(mongo.get('imageURL'));

    axios.post('http://localhost:8082/api/image/', mongo)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log("The mongo submission failed");
        })
};