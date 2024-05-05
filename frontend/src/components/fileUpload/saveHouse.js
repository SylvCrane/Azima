//import RoomContainer from "./RoomContainer";
import axios from 'axios';
//import { mongoSubmit } from "./mongoSubmit";




export async function saveHouse( houseID, imageReferences) {





    const houseData = {
        houseID: houseID,
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
      };

        const response = await axios.post('http://localhost:8082/api/house/house', houseData);
        console.log(response.data.msg);
        clearImages();
        return response.data.msg;
    }
    
    async function clearImages() {
        try {
          const response = await axios.delete(`http://localhost:8082/api/image`);
          console.log(response.data.msg);
          
          // Additional logic to handle successful deletion
        } catch (error) {
          console.error('Error deleting images:', error.response ? error.response.data : error.message);
          // Error handling logic
        }
      }