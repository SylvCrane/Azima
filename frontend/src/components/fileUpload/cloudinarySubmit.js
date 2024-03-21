import axios from 'axios';

export async function cloudinarySubmit(FormData) {
    console.log(FormData.get('upload_preset'));
    console.log(FormData.get('file'));
    
    try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dvereyxc0/image/upload', FormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response);
        return response.data.secure_url;
    }
    catch (err) {
        console.log("The cloudinary submission failed", err);
        throw err;
    }
        
};