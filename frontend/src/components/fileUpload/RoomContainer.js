import React, { useState, useEffect } from 'react';
import RoomForm from './RoomForm';
import axios from 'axios';
import { savePhotos } from './savePhotos.js';
import { saveHouse } from './saveHouse.js';


let counter =0;




function RoomContainer(props) {
  /*let saved =false;*/
  const [houseName, setHouseName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  /*let response = [];*/



useEffect(() => {
  
    if (saveSuccessful) {
        const event = new CustomEvent('saveSuccessful', { detail: { houseID: houseName } });
        window.dispatchEvent(event);
        console.log(event.detail.houseID);
        // Navigate to a different URL if needed, or handle the event in another way
        window.location.href = `/editor/aframe?houseID=${encodeURIComponent(houseName)}`;
    }
}, [saveSuccessful, houseName]); 


  useEffect(() => {
    // Define the event listener
    const handleImageUploadSuccess = async (e) => {
      try {
        const res = await axios.get(`http://localhost:8082/api/image/${e.detail.houseId}`);
        const response = res.data; 
        if (response.length === counter) { // Assuming you want to check if there's any data
          saveHouse(e.detail.houseId, response).then(() => {
            setSaveSuccessful(true);
          }).catch(error => {
            console.error('Failed to save house', error);
          });
        }
      } catch (error) {
        console.error('Failed to fetch image data', error);
      }
    };

    // Attach event listener
    document.addEventListener("imageUploadSuccess", handleImageUploadSuccess);
    return () => {
        document.removeEventListener("imageUploadSuccess", handleImageUploadSuccess);
      };
    }, []);

  const addRoom = () => {
      setRooms([...rooms, { id:counter++, name: '', file: null }]);
      console.log(rooms);
      console.log(counter);
  };

  const removeRoom = (id) => {
      setRooms(rooms.filter(room => room.id !== id));
      counter--;
  };

  const updateRoom = (id, name, file) => {
    const newRooms = rooms.map(room => (room.id === id ? { ...room, name, file } : room));
    setRooms(newRooms);

  };

  const handleHouseNameChange = (e) => {
    setHouseName(e.target.value);
    
    
  };

  const handleSave = async () => {
    try {
        // Save all photos at once; savePhotos should handle the array of rooms
        await savePhotos(rooms, { houseID: houseName });

        // Fetch image references only after all photos have been saved
     // Assuming this is the format



    } catch (error) {
      console.error('Error during the saving process:', error);
    }
  };
  


    if (saveSuccessful) {
        // The navigation logic has been moved to useEffect for better practices
        return null;
      } else {
    return (
      <div>
        <form className="inputForm">
          <h1>House Name</h1>
          <input
            type="text"
            placeholder="Enter text"
            value={houseName}
            onChange={handleHouseNameChange}
          />
        </form>
        <button onClick={addRoom} id="addButton">Add Room</button>
        <div className="forms-container">
          {rooms.map(room => (
            <RoomForm
              key={room.id}
              onRemove={() => removeRoom(room.id)}
              onUpdate={(name, file) => updateRoom(room.id, name, file)}
            />
          ))}
        </div>
        <button onClick={handleSave} id="saveButton">Save All</button>
     
      </div>
    );
  }
}
export default RoomContainer;
