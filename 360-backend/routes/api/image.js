const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let Image = require('../../models/Image');

const upload = multer();

router.post('/', upload.none(), (req, res) => {
    console.log(req.body);
    Image.create(req.body)
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/', (req, res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

router.get('/:id', (req, res) => {
    Image.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

router.get('/groupimage/:houseID', (req, res) => {
    Image.find( { "houseID" : req.params.houseID} )
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

module.exports = router;