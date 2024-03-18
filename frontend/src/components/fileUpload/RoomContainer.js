import React, { useState } from 'react';
import RoomForm from './RoomForm';
import axios from 'axios';
import { savePhotos } from './savePhotos.js';
import { saveHouse } from './saveHouse.js';
let response = [];
let counter =0;

document.addEventListener("imageUploadSuccess", async function (e) {
    
    try {
        const res = await axios.get(`http://localhost:8082/api/image/${e.detail.houseId}`);
        response = res.data; 
        console.log(response);
        console.log(response.length)
        if(response.length ===counter){// Now response will hold the fetched data
            saveHouse(e.detail.houseId, response);
        }
    } catch (error) {
        console.error('Failed to fetch image data', error);
    }
});


function RoomContainer(props) {
    let saved =false;
  const [houseName, setHouseName] = useState('');
  const [rooms, setRooms] = useState([]);

  const addRoom = () => {
    setRooms([...rooms, { id:counter++, name: '', file: null }]);
    console.log(rooms);
    console.log(counter);
  };

  const removeRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
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
      <button onClick={handleSave} id="saveButton">Save All </button>
    </div>
  );
}
export default RoomContainer;
