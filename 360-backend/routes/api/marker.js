const router = require('express').Router();
const marker = require('../../models/Marker');

router.post('/marker', (req, res) => {
    Marker.create(req.body)
        .then(marker => res.json({ msg: 'marker added successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to add marker'}));
});

router.get('/marker/:id', (req, res) => {
    Marker.findById(req.params.id, req.body)
        .then(marker => res.json({msg: 'marker updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update marker'}));
});

router.put('/marker/:id', (req, res) => {
    Marker.findByIdAndUpdate(req.params.id, req.body)
        .then(marker => res.json({msg: 'marker updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update marker'}));
});

router.put('/marker/:id', (req, res) => {
    Marker.findByIdAndUpdate(req.params.id, req.body)
        .then(marker => res.json({msg: 'marker updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update marker'}));
});

//This method will get multiple images based on the houseID.
router.get('/markerpuller/:houseID', (req, res) => {
    marker.find( { "houseID" : req.params.houseID} )
        .then(images => res.json(images))
        .catch(err => res.status(404).json({ noimagefound: 'No Image Found'}));
});

module.exports = router;