import React, { useState, useEffect } from 'react';
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
      <h1>House info</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="inputForm">
          <div className="form-group">
            <div>
              <span>Number of Bathrooms</span>
              <input type="number" name="bathrooms" placeholder="" value={formData.bathrooms} onChange={handleChange} required /><br />
            </div>
            <div>
              <span>Number of Living Areas</span>
              <input type="number" name="livingAreas" placeholder="" value={formData.livingAreas} onChange={handleChange} required /><br />
            </div>
            <div>
              <span>Number of Kitchens</span>
              <input type="number" name="kitchen" placeholder="" value={formData.kitchen} onChange={handleChange} required /><br />
            </div>

            <label>
              Backyard:
              <input type="checkbox" name="backyard" checked={formData.backyard} onChange={handleChange} />
            </label><br />

            <label>
              Laundry Room:
              <input type="checkbox" name="laundryRoom" checked={formData.laundryRoom} onChange={handleChange} />
            </label><br />

            <div>
              <span>Sq Footage</span>
              <input type="text" name="sqFootage" placeholder="Square Footage" value={formData.sqFootage} onChange={handleChange} required /><br />
            </div>
            <div>
              <span>Price</span>
              <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required /><br />
            </div>
            <div>
              <span>Date Available</span>
              <input type="date" name="dateListed" value={formData.dateListed} onChange={handleChange} required /><br />
            </div>
            <div>
              <span>Address</span>
              <input type="text" name="location" placeholder="" value={formData.location} onChange={handleChange} required /><br />
            </div>
          </div>
          <div className="file-container" onClick={() => document.getElementById('fileInput').click()}>
            <label className="custom-file-upload" >
              Upload a Thumbnail
              <input
                id="fileInput"
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
            <p>Selected file: {file ? file.name : 'None'}</p>
          </div>
          <button className ='submit'type="submit" form="houseInfoForm" onClick={handleSubmit} style={{ marginTop: '20px' }}>Submit </button>
        </form>
      </div>
    </div>
  );
}

export default Save;