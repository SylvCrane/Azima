import { mongoSubmit } from './mongoSubmit.js';


/*Structure of 'images':

A list with each index having the following)
    - name (Name of the room)
    - image (The image itself)
  
*/

export async function savePhotos(images, houseID) {
    for (const input of images) {
        if (input.file && typeof input.file.name === 'string') {
            const mongoImageData = new FormData();
            const newImageName = input.name + houseID.houseID + '.' + input.file.name.split('.').pop();
            const renamedImage = new File([input.file], newImageName, { type: input.file.type });

            mongoImageData.append('image', renamedImage); // Ensure 'image' matches the multer field name
            mongoImageData.append('name', input.name);
            mongoImageData.append('houseID', houseID.houseID);

            // Log the entries for debugging
            for (let pair of mongoImageData.entries()) {
                console.log(`${pair[0]}, ${pair[1]}`);
            }

            mongoSubmit(mongoImageData, houseID.houseID, newImageName);
        } else {
            console.error('Input file is undefined or does not have a name property:', input);
        }
    }
}