const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let Image = require('../../models/Image');

const upload = multer();

//Currently, this method will post an array of images
router.post('/image', upload.none(), (req, res) => {
    console.log(req.body);
    Image.insertMany(req.body)
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/image', (req, res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

router.get('/image/:id', (req, res) => {
    Image.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

//This method will get multiple images based on the houseID.
router.get('/image/imagepuller/:houseID', (req, res) => {
    Image.find( { "houseID" : req.params.houseID} )
        .then(images => res.json(images))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

module.exports = router;