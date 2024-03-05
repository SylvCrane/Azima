import axios from 'axios';

/* Function takes in houseID and returns a set of photos associated with that houseID*/ 
export async function LoadPhotos(houseID) {

    try {
        const response = await axios.get(`http://localhost:8082/api/image/groupimage/${houseID}`);
        return response.data;
    }
    catch (err) {
        console.log("No images loaded", err);
        throw err;
    }

}

/*Some Notes:

When calling this file, make sure it is done with an 'await', as this process needs to happen before the A-Frame component
is loaded in fully. Like so:

(async () => {
            const calledImages = await LoadPhotos(houseID);
            setImages(calledImages);
        })();

        */