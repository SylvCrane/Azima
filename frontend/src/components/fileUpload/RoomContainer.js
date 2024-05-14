import React, { useState, useEffect } from 'react';
import RoomForm from './RoomForm';
import axios from 'axios';
import { savePhotos } from './savePhotos.js';
import { saveHouse } from './saveHouse.js';
import "../../css/editor.css";
import { useUser } from "../../authentication/UserState.js";

let counter = 0;

function RoomContainer() {
    const [houseName, setHouseName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [saveSuccessful, setSaveSuccessful] = useState(false);
    const [user] = useUser();
    const [houseID, setHouseID] = useState('');


  
    useEffect(() => {
        if (saveSuccessful) {
            const event = new CustomEvent('saveSuccessful', { detail: { houseID: houseID, houseName : houseName } });
            window.dispatchEvent(event);
            console.log(event.detail.houseID);
            window.location.href = `/editor/aframe?houseID=${encodeURIComponent(houseID)}`;
        }
    }, [saveSuccessful, houseName, houseID]);

    useEffect(() => {
        const handleImageUploadSuccess = async (e) => {
            try {
                const res = await axios.get(`http://localhost:8082/api/image/${e.detail.houseId}`);
                const response = res.data; 
                const username = user.email;
                if (response.length === counter) {
                    saveHouse(e.detail.houseId, response, username, houseName).then(() => {
                        setSaveSuccessful(true);
                    }).catch(error => {
                        console.error('Failed to save house', error);
                    });
                }
            } catch (error) {
                console.error('Failed to fetch image data', error);
            }
        };
        document.addEventListener("imageUploadSuccess", handleImageUploadSuccess);
        return () => {
            document.removeEventListener("imageUploadSuccess", handleImageUploadSuccess);
        };
    }, [houseName, user.firstName, user.lastName]);

    const addRoom = () => {
        setRooms([...rooms, { id: counter++, name: '', file: null }]);
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
        const houseid = generateUniqueIdentifier();
    setHouseID(houseid);
    console.log(houseid);
        try {
           
            await savePhotos(rooms, { houseID: houseid });
        } catch (error) {
            console.error('Error during the saving process:', error);
        }
    };

    const generateUniqueIdentifier = () => {
        return "id-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    }
    

   

    if (saveSuccessful) {
        return null;
    } else {
        return (
            <div className="editor-form">
                <form className="inputForm">
                    <h1>Tour Name</h1>
                    <input
                        type="text"
                        placeholder="Type your tour name"
                        value={houseName}
                        onChange={handleHouseNameChange}
                    />
                </form>

                <div className="forms-container">
                    {rooms.map(room => (
                        <div className="form-instance" key={room.id}>
                            <RoomForm
                                onRemove={() => removeRoom(room.id)}
                                onUpdate={(name, file) => updateRoom(room.id, name, file)}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <button onClick={addRoom} id="addButton">Add Room</button>
                    <button onClick={handleSave} id="saveButton">Save All</button>
                </div>
            </div>
        );
    }
}

export default RoomContainer;