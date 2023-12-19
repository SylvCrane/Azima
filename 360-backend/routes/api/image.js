const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require("path")
let Image = require('../../models/Image');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb (null, 'images');
    },
    filename: function(req, file, cb) {
        const imageName = req.body.imageName;
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

let upload = multer({ storage, fileFilter });

router.route('/add').post( upload.single('photo'), (req, res) => {
    Image.create(req.body)
        .then(image => res.json({ msg: 'Image added successfully'}))
        .catch(err => res.status(404).json({error: 'Unable to add image'}));
});

router.get('/:')




module.exports = router;