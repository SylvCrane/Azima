import React, { useState, useEffect } from 'react';
import '../../css/publish.css'; // Ensure this path is correct

function Save() {
    const [formData, setFormData] = useState({
        bathrooms: '',
        livingAreas: '',
        kitchens: '',
        backyard: false,
        laundryRoom: false,
        sqFootage: '',
        price: '',
        dateListed: '',
        location: '',
        public: false,
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveSuccessful, setSaveSuccessful] = useState(false);

    useEffect(() => {
        if (saveSuccessful) {
            window.location.href = `/tours`; // Redirect on successful save
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Implement your submission logic here
        setIsSubmitting(false);
        setSaveSuccessful(true); // Assuming success for demonstration
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
                            <input type="checkbox" name="public" checked={formData.publoc} onChange={handleChange} />
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