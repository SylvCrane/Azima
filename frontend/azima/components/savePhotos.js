import { mongoSubmit } from './mongoSubmit.js';


/*Structure of 'images':

A list with each index having the following)
    - name (Name of the room)
    - image (The image itself)
    - imageTimeline (The point the image is at in the timeline. At the moment, I have it working for numbers
*/

export async function savePhotos(images, houseID) {

    for (const input of images) {

        const cloudinaryImageData = new FormData();
        const mongoImageData = new FormData();
    
        //Needed for uploading with API
        cloudinaryImageData.append('upload_preset', 'padivlol');
    
        
        const newImageName =  input.name + input.imageTimeline + houseID.houseID + '.' + input.image.name.split('.').pop();
        const renamedImage = new File([input.image], newImageName, {type: input.image.type});

        if (input.image)
        {
            cloudinaryImageData.append('file', renamedImage);
        }

        mongoImageData.append('name', input.name);
        mongoImageData.append('imageTimeline', input.imageTimeline);
        mongoImageData.append('houseID', houseID.houseID);
        

        //console.log(mongoImageData.get('images[0]'));
        for (var pair of mongoImageData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        console.log(cloudinaryImageData.get('file'));

        mongoSubmit(cloudinaryImageData, mongoImageData);
    }
};