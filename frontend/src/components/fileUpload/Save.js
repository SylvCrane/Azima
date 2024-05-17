import React, { useState, useEffect } from 'react';
import '../../css/publish.css'; // Ensure this path is correct


import { savePhotos } from './savePhotos.js';
import axios from 'axios';

const params = new URLSearchParams(window.location.search);
  console.log(params);
const houseID = params.get('houseID');
console.log("houseid: ",houseID)


function Save() {
  const [formData, setFormData] = useState({
    thumbnail: '', // Assuming this will be handled differently, maybe file upload
    bathrooms: '',
    livingAreas: '',
    sqFootage: '',
    price: '',
    dateListed: '',
    location: '',
    kitchen: '',
    backyard: false,
    laundryRoom: false,
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessful, setSaveSuccessful] = useState(false);

    useEffect(() => {
      if (saveSuccessful) {
        const deleteImages = async () => {
          try {
            const response = await axios.delete(`http://localhost:8082/api/image`);
            console.log(response.data.msg);
            
            // Additional logic to handle successful deletion
          } catch (error) {
            console.error('Error deleting images:', error.response ? error.response.data : error.message);
            // Error handling logic
          }
          window.location.href = `/tours`;
        };

        deleteImages();
      }
  }, [saveSuccessful]); 

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));

  };
  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setFile(newFile); // Update the file state with the new file object
  };
  const handleSubmit = async (event) => {
    console.log(formData);
    event.preventDefault();
    if (!file) {
      alert('Please upload a thumbnail image.');
      return;
    }
    setIsSubmitting(true);
   
      
    try {
      // Save all photos at once; savePhotos should handle the array of rooms
 await savePhotos([{ name: 'thumbnail', file }], {houseID: houseID});

      // Fetch image references only after all photos have been saved
   // Assuming this is the format



  } catch (error) {
    console.error('Error during the saving process:', error);
  }
  };
  useEffect(() => {
    // Define the event listener
    console.log(formData);
    const handleImageUploadSuccess = async (e) => {
      console.log('upload success');
      try {
        const res = await axios.get(`http://localhost:8082/api/image/${e.detail.houseId}`);
        const response = res.data; 
       console.log(response);
    
     
        const updatedFormData = { ...formData };
        // simulate fetching data and updating it based on fetched data
        updatedFormData.thumbnail = response[0].imageURL;
        setFormData(updatedFormData);
         console.log(updatedFormData);

         const putResponse = await axios.put(`http://localhost:8082/api/house/house/update/${e.detail.houseId}`, updatedFormData);
         console.log('House updated successfully:', putResponse.data);

         // Optionally set state to reflect that save operation was successful
         setSaveSuccessful(true);
         
        
      } catch (error) {
        console.error('Failed to fetch image data', error);
      }

    };

    // Attach event listener
    document.addEventListener("imageUploadSuccess", handleImageUploadSuccess);
    return () => {
        document.removeEventListener("imageUploadSuccess", handleImageUploadSuccess);
      };
    }, [formData]);

    return (
        <div className="Save">
            <div className="form-container">
                <h1>Tour Info</h1>
                <form onSubmit={handleSubmit} className="inputForm">
                    <div className="number-group">
                        <div className="form-group">
                            <label>Number of Bedrooms</label>
                            <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} min="0" required />
                        </div>
                        <div className="form-group">
                            <label>Number of Bathrooms</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" required />
                        </div>
                        <div className="form-group">
                            <label>Number of Living Areas</label>
                            <input type="number" name="livingAreas" value={formData.livingAreas} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                    <div className="text-group">
                        <div className="form-group">
                            <label>Square Footage</label>
                            <input type="text" name="sqFootage" value={formData.sqFootage} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="line-group">
                        <div className="date-group">
                            <div className="form-group">
                                <label>Date Available</label>
                                <input type="date" name="dateListed" value={formData.dateListed} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="textbox-group">
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="checkbox-group">
                        <div className="form-group">
                            <label>Laundry Room:</label>
                            <input type="checkbox" name="laundryRoom" checked={formData.laundryRoom} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Backyard:</label>
                            <input type="checkbox" name="backyard" checked={formData.backyard} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Share Publicly:</label>
                            <input type="checkbox" name="public" checked={formData.public} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="file-container">
                        <label className="custom-file-upload">
                            Upload a Thumbnail
                            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                        </label>
                        <p>Selected file: {file ? file.name : 'None'}</p>
                    </div>

                    <div className="submit-button-container">
                        <button type="submit" className="submit">Submit</button>
                    </div>

                    
                </form>
            </div>
        </div>
    );
}

export default Save;