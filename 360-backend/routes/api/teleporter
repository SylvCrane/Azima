const router = require('express').Router();
const Teleporter = require('../../models/Teleporter');

router.post('/teleporter', (req, res) => {
    Teleporter.create(req.body)
        .then(teleporter => res.json({ msg: 'teleporter added successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to add teleporter'}));
});

router.get('/teleporter/:id', (req, res) => {
    Teleporter.findById(req.params.id, req.body)
        .then(teleporter => res.json({msg: 'teleporter updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update teleporter'}));
});

//This method will get multiple images based on the houseID.
router.get('/puller/:houseID', (req, res) => {
    Teleporter.find( { "houseID" : req.params.houseID} )
        .then(images => res.json(images))
        .catch(err => res.status(404).json({ noimagefound: 'Teleporters cannot be loaded'}));
});

router.put('/teleporter/:id', (req, res) => {
    Teleporter.findByIdAndUpdate(req.params.id, req.body)
        .then(teleporter => res.json({msg: 'teleporter updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update teleporter'}));
});

router.delete('/teleporter/:id', (req, res) => {
    Teleporter.findByIdAndRemove(req.params.id, req.body)
        .then(teleporter => res.json({msg: 'House successfully deleted'}))
        .catch(err => res.status(404).json({error: 'No such teleporter'}));
});

module.exports = router;