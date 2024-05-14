import React, { useState, useEffect } from 'react';
import '../../css/publish.css'; // Ensure this path is correct

function Save() {
    const [formData, setFormData] = useState({
        bedroom: '',
        bathrooms: '',
        livingAreas: '',
        kitchens: '',
        backyard: false,
        laundryRoom: false,
        sqFootage: '',
        price: '',
        dateListed: new Date().toISOString().substr(0, 10), // Set current date as default
        location: '',
        public: false,
    });
    const [file, setFile] = useState(null);
    const [submitting, setIsSubmitting] = useState(false);
    const [saveSuccessful, setSaveSuccessful] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (saveSuccessful) {
            window.location.href = `/account`; // Redirect to account page when save is successful (their tour should be saved here).
        }
    }, [saveSuccessful]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Ensures that all fields (except the checkboxes are filled )
    const validateForm = (formData, file) => {
      const newErrors = [];
      
      if (!formData.bedroom || formData.bedroom.trim() === '') newErrors.push('Number of bedrooms is required');
      if (!formData.bathrooms || formData.bathrooms.trim() === '') newErrors.push('Number of bathrooms is required');
      if (!formData.livingAreas || formData.livingAreas.trim() === '') newErrors.push('Number of living areas is required');
      if (!formData.sqFootage || formData.sqFootage.trim() === '') newErrors.push('Square footage is required');
      if (!formData.price || formData.price.trim() === '') newErrors.push('Price is required');
      if (!formData.dateListed || formData.dateListed.trim() === '') newErrors.push('Date available is required');
      if (!formData.location || formData.location.trim() === '') newErrors.push('Address is required');
      if (!file) newErrors.push('File upload is required');
  
      return newErrors;
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validateForm();
        if (newErrors.length > 0) {
            setAlertMessage(newErrors.join('. '));
            setSuccessMessage('');
            return;
        }
        setIsSubmitting(true);
        setIsSubmitting(false);
        setSaveSuccessful(true); // Assuming success for demonstration
        setAlertMessage('');
        setSuccessMessage('Form submitted successfully!');
    };

    return (
        <div className="Save">
            <h1>House Info</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="inputForm">
                    <div className="number-group">
                        <div className="form-group">
                            <label>Number of Bedrooms</label>
                            <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Number of Bathrooms</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Number of Living Areas</label>
                            <input type="number" name="livingAreas" value={formData.livingAreas} onChange={handleChange} required />
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

                    {successMessage && 
                        <div className="success">{successMessage}</div>
                    }
                    {alertMessage && 
                        <div className="alert">{alertMessage}</div>
                    }
                </form>
            </div>
        </div>
    );
}

export default Save;