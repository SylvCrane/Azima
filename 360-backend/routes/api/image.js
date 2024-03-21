const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let Image = require('../../models/Image');

const upload = multer();

router.post('/', upload.none(), (req, res) => {
    let imageData = {
        ...req.body,
        houseID: req.houseId // Use the houseId passed from the parent route
    };

    Image.create(imageData)
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/', (req, res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

router.delete('/', async (req, res) => {
    try {

      const result = await Image.deleteMany({ }); // Ensure field name matches your schema
      
      if (result.deletedCount > 0) {
        res.json({ msg: `${result.deletedCount} images deleted successfully` });
      } else {
        res.status(404).json({ error: 'No images found for the specified house ID' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Server error while deleting images' });
    }
  });

router.get('/:houseID', (req, res) => {
    Image.find( { "houseID" : req.params.houseID} )
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

module.exports = router;