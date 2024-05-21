import axios from 'axios';

export async function mongoSubmit(mongo, houseId, newImageName) {
    const imageURL = "http://localhost:8082/images/"+ newImageName;
    console.log("newImageName: " ,newImageName);
    mongo.append('imageURL', imageURL);
    console.log("mongo name:", mongo.get('name'));
    console.log("mongo imageURL:", mongo.get('imageURL'));
    console.log("mongo houseID:", mongo.get('houseID'));
    houseId = mongo.get('houseID');
    axios.post('http://localhost:8082/api/image/' ,mongo, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(res => {
        
        const event = new CustomEvent('imageUploadSuccess', { detail: { houseId: houseId } });
        document.dispatchEvent(event);
        console.log("The mongo submission was successful");
    })
    .catch(err => {
        console.log("The mongo submission failed");
        console.log(err.message);

        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } 
        else if (err.request) {
            // The request was made but no response was received
            console.log(err.request);
        } 
        else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
        }
    });
}
