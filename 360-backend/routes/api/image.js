const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let Image = require('../../models/Image');

const upload = multer();

router.post('/', upload.none(), (req, res) => {
<<<<<<< HEAD
    console.log(req.body);
    Image.create(req.body)
=======
    let imageData = {
        ...req.body,
        houseID: req.houseId // Use the houseId passed from the parent route
    };

    Image.create(imageData)
>>>>>>> Brandyn2
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/', (req, res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

<<<<<<< HEAD
router.get('/:id', (req, res) => {
    Image.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

router.get('/groupimage/:houseID', (req, res) => {
=======
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
>>>>>>> Brandyn2
    Image.find( { "houseID" : req.params.houseID} )
        .then(image => res.json(image))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

<<<<<<< HEAD
=======

>>>>>>> Brandyn2
module.exports = router;