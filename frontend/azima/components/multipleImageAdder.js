import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { savePhotos } from './savePhotos.js';

const MultipleImageAdder = () => {

    const [images, setImages] = useState([{
        name: '',
        image: '',
        imageTimeline: '',
    }
    ]);

    const [houseID, setHouseID] = useState ({});
        
    const handleHouseID =(e) => {
        setHouseID({houseID, [e.target.name]: e.target.value});
    };

    const addNewImageField = () => {
        setImages([...images, {name: '', image: '', imageTimeline: ''}])
    };

    const handleChange = (index, type, value) => {
        const newImages = [...images];

        if (type === 'file')
        {
            newImages[index].image = value;
        }
        else if (type === 'text')
        {
            newImages[index].name = value;
        }
        else if (type === 'number')
        {
            newImages[index].imageTimeline = value; 
        }

        setImages(newImages);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        savePhotos(images, houseID);
    };

    return(
        <>
        <div id = "newImage">
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
            {images.map((input, index) => (
                <div key = {index}>
                    <input 
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="image"
                    onChange={(e) => handleChange(index, 'file', e.target.files[0])}/>

                    <input 
                    type="text"
                    placeholder="name"
                    name="name"
                    onChange={(e) => handleChange(index, 'text', e.target.value)}/>

                    <input
                    type="number"
                    placeholder="imageTimeline"
                    name="imageTimeline"
                    onChange={(e) => handleChange(index, 'number', e.target.value)}/>
                </div>
            ))}
            <input
            type="text"
            placeholder="houseID"
            name="houseID"
            onChange={handleHouseID} />
            <button type = "submit">Submit Images</button>
        </form>
        </div>
        <button class="add" onClick={addNewImageField}>Add</button>
        <br />
        <div className='links'>
        <Link to='/'>
            Return to image List
        </Link>

        </div></>
    )
    
};

export default MultipleImageAdder;