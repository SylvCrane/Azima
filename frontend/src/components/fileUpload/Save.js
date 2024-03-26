import React, { useState } from 'react';

function Save(props) {
  const [formData, setFormData] = useState({
    images: [], // Assuming this will be handled differently, maybe file upload
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Here you would typically send the formData to your server
  };

return (
    <div className="Save">
       <h2>House info</h2>
        <div className="form-container">
            <form onSubmit={handleSubmit} className="inputForm">
                <div className="form-group">
                    <div>
                    <span>Bathrooms</span>
                    <input type="number" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} required /><br />
                    </div>
                    <div>
                    <span>Living Areas</span>
                    <input type="number" name="livingAreas" placeholder="Living Areas" value={formData.livingAreas} onChange={handleChange} required /><br />
                    </div>
                    <div>
                    <span>Kitchens</span>
                    
               
                    <input type="number" name="kitchen" placeholder="Kitchen" value={formData.kitchen} onChange={handleChange} required /><br />
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
                    <span>Date Listed</span>
                    <input type="date" name="dateListed" value={formData.dateListed} onChange={handleChange} required /><br />
                    </div>
                    <div>
                    <span>Address</span>
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required /><br />
                    </div>
                    {/* Handle images differently, e.g., with a file input */}
                </div>
                <div className="file-container">
                    <label className="custom-file-upload">
                        Upload a Thumbnail
                        <input
                            type="file"
                            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                            style={{ display: 'none' }}
                        />
                    </label>
                    <p>Selected file: </p>
                </div>
                <button type="submit" form="houseInfoForm" style={{ marginTop: '20px' }}>Submit</button>
            </form>
        </div>
    </div>
);
}

export default Save;