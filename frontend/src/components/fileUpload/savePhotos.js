import { mongoSubmit } from './mongoSubmit.js';


/*Structure of 'images':

A list with each index having the following)
    - name (Name of the room)
    - image (The image itself)
  
*/

export async function savePhotos(images, houseID) {
    for (const input of images) {
        // Adjusting the check to input.file based on the structure provided
        if (input.file && typeof input.file.name === 'string') {
            const cloudinaryImageData = new FormData();
            const mongoImageData = new FormData();

            //Needed for uploading with API
            cloudinaryImageData.append('upload_preset', 'padivlol');

            const newImageName = input.name + houseID.houseID + '.' + input.file.name.split('.').pop();
            const renamedImage = new File([input.file], newImageName, {type: input.file.type});

            cloudinaryImageData.append('file', renamedImage);

            mongoImageData.append('name', input.name);
            mongoImageData.append('houseID', houseID.houseID);

            // Log the entries for debugging
            for (let pair of mongoImageData.entries()) {
                console.log(`${pair[0]}, ${pair[1]}`);
            }
            console.log(cloudinaryImageData.get('file'));

            mongoSubmit(cloudinaryImageData, mongoImageData, houseID.houseID);
        } else {
            console.error('Input file is undefined or does not have a name property:', input);
        }
    }
};