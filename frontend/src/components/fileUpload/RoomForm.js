
import React, { useState } from 'react';
import "../../css/editor.css";

function RoomForm({ onRemove, onUpdate }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onUpdate(newName, file); // Assuming you want to lift state up for some reason
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    onUpdate(name, newFile); // Same as above
  };

  return (
    <div className="form-instance">
      <form className="inputForm">
        <h2>Room</h2>
        <input
          type="text"
          placeholder="Type your room name"
          value={name}
          onChange={handleNameChange}
        />
      </form>
      <div className="file-upload-container" style={{ padding: '20px', border: '2px dashed #ccc', cursor: 'pointer', textAlign: 'center' }}>
        <label className="custom-file-upload">
          Upload a 360° image:
          <input
            type="file"
            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>
        <p>Selected file: {file ? file.name : 'None'}</p>
      </div>
      <button id="cancelButton" onClick={onRemove}>Remove</button>
    </div>
  );
}
export default RoomForm;