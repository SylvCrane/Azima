const router = require('express').Router();
const multer = require('multer');
const path = require("path");
let Image = require('../../models/Image');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images'); // Will save house images uploaded in these folders.
  },
  filename: function(req, file, cb) {
      const imageName = file.originalname;
      cb(null, imageName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedFileTypes.includes(file.mimetype))
  {
      cb (null, true);
  }
  else
  {
      cb(null, false);
  }
}
const upload = multer({ storage, fileFilter });

router.post('/', upload.single('image'), (req, res) => {
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