const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let ShowcaseImage = require('../../models/ShowcaseImage');

const upload = multer();

//Currently, this method will post an array of the frontend showcase images
router.post('/showcaseimage', upload.none(), (req, res) => {
    console.log(req.body);
    ShowcaseImage.insertMany(req.body)
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/showcaseimage', (req, res) => {
    ShowcaseImage.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

router.get('/showcaseimage/:id', (req, res) => {
    ShowcaseImage.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

//This method will get multiple images based on the houseID.
router.get('/showcaseimage/imagepuller/:houseID', (req, res) => {
    ShowcaseImage.find( { "houseID" : req.params.houseID} )
        .then(images => res.json(images))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

module.exports = router;