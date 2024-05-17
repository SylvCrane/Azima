import React, { useState, useEffect } from 'react';
import '../../css/publish.css'; // Ensure this path is correct
import axios from 'axios';
import { savePhotos } from './savePhotos.js';

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
        thumbnail: '',
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveSuccessful, setSaveSuccessful] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const params = new URLSearchParams(window.location.search);
    const houseID = params.get('houseID');

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
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        setFile(newFile); // Update the file state with the new file object
    };

    // Ensures that all fields (except the checkboxes) are filled
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
        const newErrors = validateForm(formData, file); // Pass formData and file here
        if (newErrors.length > 0) {
            setAlertMessage(newErrors.join('. '));
            setSuccessMessage('');
            return;
        }
        setIsSubmitting(true);

        try {
            // Save the thumbnail
            await savePhotos([{ name: 'thumbnail', file }], { houseID });

            // Fetch image references only after all photos have been saved
            const res = await axios.get(`http://localhost:8082/api/image/${houseID}`);
            const response = res.data;

            const updatedFormData = { ...formData, thumbnail: response[0].imageURL };

            // Update house data with form data
            const putResponse = await axios.put(`http://localhost:8082/api/house/house/update/${houseID}`, updatedFormData);
            console.log('House updated successfully:', putResponse.data);

            setSaveSuccessful(true); // Assuming success for demonstration
            setAlertMessage('');
            setSuccessMessage('Form submitted successfully!');
        } catch (error) {
            console.error('Error during the saving process:', error);
            setAlertMessage('Error during the saving process. Please try again.');
            setSuccessMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const handleImageUploadSuccess = async (e) => {
            try {
                const res = await axios.get(`http://localhost:8082/api/image/${e.detail.houseId}`);
                const response = res.data;

                const updatedFormData = { ...formData, thumbnail: response[0].imageURL };
                setFormData(updatedFormData);

                const putResponse = await axios.put(`http://localhost:8082/api/house/house/update/${e.detail.houseId}`, updatedFormData);
                console.log('House updated successfully:', putResponse.data);

                setSaveSuccessful(true);
            } catch (error) {
                console.error('Failed to fetch image data', error);
            }
        };

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
                        <button type="submit" className="submit" disabled={isSubmitting}>Submit</button>
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