//import RoomContainer from "./RoomContainer";
import axios from 'axios';
//import { mongoSubmit } from "./mongoSubmit";

async function houseIDExists(houseID) {
  try {
    const response = await axios.get('https://azimatours.onrender.com/api/house/house/puller/$(houseId}');
    return response.data.exists; // Assuming the response returns { exists: true/false }
  } catch (error) {
    console.error('Error checking if houseID exists:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
}



export async function saveHouse( houseID, imageReferences, user, houseName) {

  const exists = await houseIDExists(houseID);
  if (exists) {
    return; // Do nothing if house ID already exists
  }

 
    console.log(imageReferences);


    const houseData = {
        houseID: houseID,
        houseName: houseName,
        rooms: imageReferences.length, // Or any other logic to determine room count
        images: imageReferences, // Map your room data to your image schema
        // Add an empty array for portals
        portals: [],
        thumbnail: imageReferences[0], // Assuming the first image is the thumbnail
        // Continue with other fields and their default or specified values
        bathrooms: 0, // Example default values
        livingAreas: 0,
        sqFootage: 0.0, // Assuming your backend expects a string for Decimal128 type
        price: 0.00,
        dateListed: new Date().toISOString(),
        location: "Unknown",
        bedrooms: 1,
        backyard: false,
        laundryRoom: false,
        dateAvailable: new Date().toISOString(),
        author: user,
        public: false,
      };

        const response = await axios.post('https://azimatours.onrender.com/api/house/house', houseData);
        console.log(response.data.msg);
        clearImages();
        return response.data.msg;
    }
    
    async function clearImages() {
        try {
          const response = await axios.delete(`https://azimatours.onrender.com/api/image`);
          console.log(response.data.msg);
          
          // Additional logic to handle successful deletion
        } catch (error) {
          console.error('Error deleting images:', error.response ? error.response.data : error.message);
          // Error handling logic
        }
      }